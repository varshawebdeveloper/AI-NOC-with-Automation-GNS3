import requests
import uuid
import time
from backend.database import (
    get_all_device_states, update_device_state, mark_all_devices_unknown,
    get_open_alert_for_device, get_open_gns3_conn_alert,
    create_alert, resolve_alert, log_activity,
    get_all_link_states, update_link_state, remove_link_state
)

GNS3_API_BASE = "http://localhost:3080/v2"

def get_opened_project():
    try:
        r = requests.get(f"{GNS3_API_BASE}/projects", timeout=5)
        r.raise_for_status()
        projects = r.json()
        for p in projects:
            if p.get("status") == "opened":
                return p
        return None
    except Exception as e:
        print(f"[Alert Engine] Error fetching projects: {e}")
        return None

def get_nodes(project_id):
    try:
        r = requests.get(f"{GNS3_API_BASE}/projects/{project_id}/nodes", timeout=5)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"[Alert Engine] Error fetching nodes: {e}")
        return None

def get_links(project_id):
    try:
        r = requests.get(f"{GNS3_API_BASE}/projects/{project_id}/links", timeout=5)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"[Alert Engine] Error fetching links: {e}")
        return None

def generate_id():
    return str(uuid.uuid4())

def run_state_check():
    """
    Main state checking loop. Called every 10 seconds.
    """
    print("[Alert Engine] Running state check...")

    project = get_opened_project()

    # ---------------------------------------------------------
    # 1. GNS3 CONNECTION LOST
    # ---------------------------------------------------------
    if project is None:
        # Check if we already have a connection alert
        conn_alert = get_open_gns3_conn_alert()
        if not conn_alert:
            print("[Alert Engine] CRITICAL - GNS3 connection lost or no open project")
            alert_id = generate_id()
            create_alert(
                alert_id=alert_id,
                device_id="system",
                device_name="GNS3 Server",
                severity="critical",
                message="CRITICAL — Unable to communicate with GNS3 or no project opened",
                is_gns3_conn=True
            )
            log_activity(generate_id(), "GNS3 Server", "critical", "GNS3 connection lost")
            
            # Mark all devices as UNKNOWN (do not false alert them as offline)
            mark_all_devices_unknown()
        return

    # ---------------------------------------------------------
    # 2. GNS3 CONNECTION RESTORED
    # ---------------------------------------------------------
    conn_alert = get_open_gns3_conn_alert()
    if conn_alert:
        print("[Alert Engine] RESOLVED - GNS3 connection restored")
        resolve_alert(conn_alert["id"], "RESOLVED — GNS3 connection restored")
        log_activity(generate_id(), "GNS3 Server", "success", "GNS3 connection restored")

    # ---------------------------------------------------------
    # 3. DEVICE STATE CHANGES
    # ---------------------------------------------------------
    nodes = get_nodes(project["project_id"])
    if nodes is None:
        return  # Failed to get nodes this tick

    previous_states = get_all_device_states()

    for node in nodes:
        node_id = node.get("node_id")
        name = node.get("name")
        # GNS3 node types (vpcs, dynamips, ethernet_switch, etc)
        node_type = node.get("node_type", "unknown")
        # GNS3 statuses: 'started', 'stopped', 'suspended'
        raw_status = node.get("status", "unknown")
        
        # Normalize status to online/offline
        current_status = "online" if raw_status == "started" else "offline"

        # Check previous state
        prev = previous_states.get(node_id)
        prev_status = prev["status"] if prev else None

        # Detect State Change
        if prev_status != current_status and prev_status != "unknown":
            # Check for existing open alerts for this device
            existing_alert = get_open_alert_for_device(node_id)

            if current_status == "offline":
                # Device went offline (or was offline on startup)
                if not existing_alert:
                    alert_id = generate_id()
                    msg = f"CRITICAL — {name} went offline"
                    create_alert(alert_id, node_id, name, "critical", msg)
                    log_activity(generate_id(), name, "critical", f"{name} went offline")
                    print(f"[Alert Engine] -> {msg}")
            
            elif current_status == "online":
                # Device recovered
                if existing_alert:
                    msg = f"RESOLVED — {name} is back online"
                    resolve_alert(existing_alert["id"], msg)
                    log_activity(generate_id(), name, "success", f"{name} came back online")
                    print(f"[Alert Engine] -> {msg}")

        # Update Database with new state
        update_device_state(node_id, name, node_type, current_status)

    # ---------------------------------------------------------
    # 4. LINK STATE CHANGES
    # ---------------------------------------------------------
    links = get_links(project["project_id"])
    if links is not None:
        previous_links = get_all_link_states(project["project_id"])
        current_signatures = set()

        # Build lookup for node names
        node_name_map = {n.get("node_id"): n.get("name") for n in nodes}

        for link in links:
            nodes_in_link = link.get("nodes", [])
            if len(nodes_in_link) >= 2:
                id_a = nodes_in_link[0].get("node_id")
                id_b = nodes_in_link[1].get("node_id")
                
                # Create normalized signature
                sorted_ids = sorted([id_a, id_b])
                signature = f'{project["project_id"]}_{sorted_ids[0]}_{sorted_ids[1]}'
                current_signatures.add(signature)

                name_a = node_name_map.get(id_a, id_a)
                name_b = node_name_map.get(id_b, id_b)

                # Check if it was previously removed/down (meaning we have an OPEN alert for it)
                alert_device_id = f"link_{signature}"
                existing_alert = get_open_alert_for_device(alert_device_id)

                if existing_alert:
                    # Link was restored!
                    msg = f"RESOLVED — Link between {name_a} and {name_b} has been restored to the GNS3 topology"
                    resolve_alert(existing_alert["id"], msg)
                    log_activity(generate_id(), f"{name_a} ↔ {name_b}", "success", f"Link restored")
                    print(f"[Alert Engine] -> {msg}")

                # Update database
                update_link_state(signature, project["project_id"], id_a, id_b, name_a, name_b)

        # Detect removed links
        for sig, prev_link in previous_links.items():
            if sig not in current_signatures:
                # Link is missing!
                alert_device_id = f"link_{sig}"
                existing_alert = get_open_alert_for_device(alert_device_id)
                
                name_a = prev_link.get("node_a_name")
                name_b = prev_link.get("node_b_name")

                if not existing_alert:
                    # Create new alert
                    alert_id = generate_id()
                    msg = f"MAJOR — Link between {name_a} and {name_b} was removed from the GNS3 topology"
                    create_alert(alert_id, alert_device_id, f"{name_a} ↔ {name_b}", "warning", msg)
                    log_activity(generate_id(), f"{name_a} ↔ {name_b}", "warning", f"Link removed")
                    print(f"[Alert Engine] -> {msg}")
                
                # Remove from known link_state so we don't alert again unless it comes back
                remove_link_state(sig)
