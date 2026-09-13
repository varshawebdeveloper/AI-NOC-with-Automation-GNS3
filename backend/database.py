import sqlite3
import json
from pathlib import Path
from datetime import datetime
import threading

DB_PATH = Path(r"E:\AI-NOC-with-Automation-GNS3\backend\noc_data.db")

# Thread-local storage for sqlite3 connection to allow usage across FastAPI/Background threads
_local = threading.local()

def get_db():
    if not hasattr(_local, "conn"):
        _local.conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
        _local.conn.row_factory = sqlite3.Row
    return _local.conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    
    # Track the last known state of each GNS3 node
    c.execute('''
        CREATE TABLE IF NOT EXISTS device_state (
            node_id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            status TEXT,
            last_updated TEXT
        )
    ''')
    
    # Store alerts with OPEN/RESOLVED lifecycle
    c.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            device_id TEXT,
            device_name TEXT,
            severity TEXT,
            message TEXT,
            status TEXT,
            created_at TEXT,
            resolved_at TEXT,
            is_gns3_conn BOOLEAN DEFAULT 0
        )
    ''')

    # Store chronological activity feed
    c.execute('''
        CREATE TABLE IF NOT EXISTS activity_feed (
            id TEXT PRIMARY KEY,
            device_name TEXT,
            type TEXT,
            message TEXT,
            timestamp TEXT
        )
    ''')
    
    # Track the last known state of each GNS3 link
    c.execute('''
        CREATE TABLE IF NOT EXISTS link_state (
            signature TEXT PRIMARY KEY,
            project_id TEXT,
            node_a_id TEXT,
            node_b_id TEXT,
            node_a_name TEXT,
            node_b_name TEXT,
            last_updated TEXT
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    ''')
    c.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('auto_mitigation', 'false')")

    conn.commit()

# ==================================================
# DEVICE HELPERS
# ==================================================

def get_all_device_states():
    c = get_db().cursor()
    c.execute("SELECT * FROM device_state")
    return {row["node_id"]: dict(row) for row in c.fetchall()}

def update_device_state(node_id, name, dev_type, status):
    c = get_db().cursor()
    now = datetime.utcnow().isoformat() + "Z"
    c.execute('''
        INSERT INTO device_state (node_id, name, type, status, last_updated)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(node_id) DO UPDATE SET 
            status=excluded.status, 
            last_updated=excluded.last_updated,
            name=excluded.name
    ''', (node_id, name, dev_type, status, now))
    get_db().commit()

def mark_all_devices_unknown():
    c = get_db().cursor()
    now = datetime.utcnow().isoformat() + "Z"
    c.execute("UPDATE device_state SET status = 'unknown', last_updated = ?", (now,))
    get_db().commit()

# ==================================================
# LINK HELPERS
# ==================================================

def get_all_link_states(project_id):
    c = get_db().cursor()
    c.execute("SELECT * FROM link_state WHERE project_id = ?", (project_id,))
    return {row["signature"]: dict(row) for row in c.fetchall()}

def update_link_state(signature, project_id, node_a_id, node_b_id, node_a_name, node_b_name):
    c = get_db().cursor()
    now = datetime.utcnow().isoformat() + "Z"
    c.execute('''
        INSERT INTO link_state (signature, project_id, node_a_id, node_b_id, node_a_name, node_b_name, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(signature) DO UPDATE SET 
            last_updated=excluded.last_updated,
            node_a_name=excluded.node_a_name,
            node_b_name=excluded.node_b_name
    ''', (signature, project_id, node_a_id, node_b_id, node_a_name, node_b_name, now))
    get_db().commit()

def remove_link_state(signature):
    c = get_db().cursor()
    c.execute("DELETE FROM link_state WHERE signature = ?", (signature,))
    get_db().commit()

# ==================================================
# ALERT HELPERS
# ==================================================

def get_open_alerts():
    c = get_db().cursor()
    c.execute("SELECT * FROM alerts WHERE status = 'OPEN' ORDER BY created_at DESC")
    return [dict(r) for r in c.fetchall()]

def get_recent_alerts(limit=50):
    c = get_db().cursor()
    c.execute("SELECT * FROM alerts ORDER BY created_at DESC LIMIT ?", (limit,))
    return [dict(r) for r in c.fetchall()]

def get_open_alert_for_device(device_id):
    c = get_db().cursor()
    c.execute("SELECT * FROM alerts WHERE device_id = ? AND status = 'OPEN'", (device_id,))
    row = c.fetchone()
    return dict(row) if row else None

def get_open_gns3_conn_alert():
    c = get_db().cursor()
    c.execute("SELECT * FROM alerts WHERE is_gns3_conn = 1 AND status = 'OPEN'")
    row = c.fetchone()
    return dict(row) if row else None

def create_alert(alert_id, device_id, device_name, severity, message, is_gns3_conn=False):
    c = get_db().cursor()
    now = datetime.utcnow().isoformat() + "Z"
    c.execute('''
        INSERT INTO alerts (id, device_id, device_name, severity, message, status, created_at, is_gns3_conn)
        VALUES (?, ?, ?, ?, ?, 'OPEN', ?, ?)
    ''', (alert_id, device_id, device_name, severity, message, now, 1 if is_gns3_conn else 0))
    get_db().commit()

def resolve_alert(alert_id, resolve_message):
    c = get_db().cursor()
    now = datetime.utcnow().isoformat() + "Z"
    # Update the message to prepend RESOLVED — and append resolution time
    c.execute('''
        UPDATE alerts 
        SET status = 'RESOLVED', resolved_at = ?, message = ?
        WHERE id = ?
    ''', (now, resolve_message, alert_id))
    get_db().commit()

def clear_all_alerts():
    c = get_db().cursor()
    now = datetime.utcnow().isoformat() + "Z"
    c.execute('''
        UPDATE alerts
        SET status = 'RESOLVED', resolved_at = ?
        WHERE status = 'OPEN'
    ''', (now,))
    get_db().commit()

def log_activity(act_id, device_name, act_type, message):
    c = get_db().cursor()
    now = datetime.utcnow().isoformat() + "Z"
    c.execute('''
        INSERT INTO activity_feed (id, device_name, type, message, timestamp)
        VALUES (?, ?, ?, ?, ?)
    ''', (act_id, device_name, act_type, message, now))
    get_db().commit()

def get_recent_activities(limit=30):
    c = get_db().cursor()
    c.execute("SELECT * FROM activity_feed ORDER BY timestamp DESC LIMIT ?", (limit,))
    return [dict(r) for r in c.fetchall()]

def get_setting(key: str, default_val: str = "") -> str:
    c = get_db().cursor()
    c.execute("SELECT value FROM settings WHERE key = ?", (key,))
    row = c.fetchone()
    return row["value"] if row else default_val

def set_setting(key: str, value: str):
    c = get_db().cursor()
    c.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, value))
    get_db().commit()

# Initialize on import
init_db()
