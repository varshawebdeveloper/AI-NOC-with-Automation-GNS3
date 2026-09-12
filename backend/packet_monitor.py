import asyncio
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from scapy.all import rdpcap, IP, ICMP, TCP, UDP
from collections import Counter
from pathlib import Path
from backend.alert_engine import run_state_check
import uuid
from backend.database import (
    get_open_alerts, get_recent_alerts, get_recent_activities, 
    get_all_device_states, create_alert, log_activity
)


# ==================================================
# FASTAPI APPLICATION
# ==================================================

app = FastAPI(title="AI-NOC Traffic Analyzer")


# ==================================================
# CORS CONFIGURATION
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",

        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:3000",
        "http://127.0.0.1:3000",

        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# PCAP CONFIGURATION
# ==================================================

PCAP_DIR = Path(r"E:\AI-NOC-with-Automation-GNS3\vaishu")

PCAP_FILES = [
    "pc1.pcapng",
    "pc2.pcapng",
    "pc3.pcapng",
    "pc4.pcapng",
    "pc5.pcapng",
    "pc6.pcapng",
    "pc7.pcapng",
]


# ==================================================
# ROOT ENDPOINT
# ==================================================

@app.get("/")
def root():
    return {
        "message": "AI-NOC Traffic Analyzer API is running"
    }

# ==================================================
# BACKGROUND SCHEDULER
# ==================================================

@app.on_event("startup")
async def startup_event():
    async def poll_gns3_state():
        while True:
            try:
                run_state_check()
            except Exception as e:
                print(f"[Alert Engine] Unhandled exception: {e}")
            await asyncio.sleep(10)
    
    asyncio.create_task(poll_gns3_state())


# ==================================================
# ANALYZE ONE PCAP
# ==================================================

def analyze_pcap(file_path):

    try:
        packets = rdpcap(str(file_path))

    except Exception as e:

        return {
            "file": file_path.name,
            "error": str(e),
            "total_packets": 0,
            "total_bytes": 0,
            "icmp": 0,
            "ospf": 0,
            "tcp": 0,
            "udp": 0,
            "other": 0,
            "top_source_ips": {},
            "top_destination_ips": {},
        }

    source_count = Counter()
    destination_count = Counter()

    total_bytes = 0

    icmp_count = 0
    ospf_count = 0
    tcp_count = 0
    udp_count = 0
    other_count = 0


    # ==================================================
    # PROCESS PACKETS
    # ==================================================

    for packet in packets:

        total_bytes += len(packet)


        # ----------------------------------------------
        # NON-IP PACKETS
        # ----------------------------------------------

        if IP not in packet:

            other_count += 1

            continue


        # ----------------------------------------------
        # SOURCE / DESTINATION
        # ----------------------------------------------

        source = packet[IP].src
        destination = packet[IP].dst

        source_count[source] += 1
        destination_count[destination] += 1


        # ----------------------------------------------
        # PROTOCOL DETECTION
        # ----------------------------------------------

        if ICMP in packet:

            icmp_count += 1

        elif TCP in packet:

            tcp_count += 1

        elif UDP in packet:

            udp_count += 1

        elif packet[IP].proto == 89:

            ospf_count += 1

        else:

            other_count += 1


    # ==================================================
    # PCAP RESULT
    # ==================================================

    return {

        "file": file_path.name,

        "total_packets": len(packets),

        "total_bytes": total_bytes,

        "icmp": icmp_count,

        "ospf": ospf_count,

        "tcp": tcp_count,

        "udp": udp_count,

        "other": other_count,

        "top_source_ips": dict(
            source_count.most_common(10)
        ),

        "top_destination_ips": dict(
            destination_count.most_common(10)
        ),
    }


# ==================================================
# AI THREAT DETECTION
# ==================================================

def detect_threats(result):
    """
    Analyze traffic statistics and identify
    potentially suspicious network behavior.
    """

    threats = []

    risk_score = 0


    # ==================================================
    # GET TRAFFIC VALUES
    # ==================================================

    icmp = result["icmp"]

    tcp = result["tcp"]

    udp = result["udp"]

    total_packets = result["total_packets"]


    # ==================================================
    # ICMP FLOOD DETECTION
    # ==================================================

    if icmp > 50:

        threats.append({
            "type": "ICMP Flood",
            "severity": "HIGH",
            "description": "Abnormally high ICMP traffic detected."
        })

        from backend.database import get_open_alert_for_device
        existing_alert = get_open_alert_for_device("network_icmp_flood")
        if not existing_alert:
            _id = str(uuid.uuid4())
            create_alert(_id, "network_icmp_flood", "Network", "critical", "CRITICAL — Abnormally high ICMP traffic detected (ICMP Flood)")
            log_activity(_id, "Network", "critical", "ICMP Flood detected")

        # CHANGED FROM 40 TO 60
        risk_score += 60


    elif icmp > 20:

        threats.append({
            "type": "Suspicious ICMP Traffic",
            "severity": "MEDIUM",
            "description": "ICMP traffic is higher than normal."
        })

        risk_score += 20


    # ==================================================
    # TCP TRAFFIC DETECTION
    # ==================================================

    if tcp > 100:

        threats.append({
            "type": "Possible TCP Flood",
            "severity": "HIGH",
            "description": "Very high TCP traffic detected."
        })

        risk_score += 30


    elif tcp > 50:

        threats.append({
            "type": "High TCP Traffic",
            "severity": "MEDIUM",
            "description": "TCP traffic exceeds the normal threshold."
        })

        risk_score += 15


    # ==================================================
    # UDP TRAFFIC DETECTION
    # ==================================================

    if udp > 100:

        threats.append({
            "type": "Possible UDP Flood",
            "severity": "HIGH",
            "description": "Very high UDP traffic detected."
        })

        risk_score += 30


    elif udp > 50:

        threats.append({
            "type": "High UDP Traffic",
            "severity": "MEDIUM",
            "description": "UDP traffic exceeds the normal threshold."
        })

        risk_score += 15


    # ==================================================
    # PACKET VOLUME DETECTION
    # ==================================================

    if total_packets > 500:

        threats.append({
            "type": "High Packet Volume",
            "severity": "MEDIUM",
            "description": "Large number of packets detected."
        })

        risk_score += 15


    # ==================================================
    # LIMIT RISK SCORE
    # ==================================================

    risk_score = min(risk_score, 100)


    # ==================================================
    # THREAT LEVEL
    # ==================================================

    if risk_score >= 80:

        threat_level = "CRITICAL"

    elif risk_score >= 60:

        threat_level = "HIGH"

    elif risk_score >= 30:

        threat_level = "MEDIUM"

    else:

        threat_level = "LOW"


    # ==================================================
    # THREAT RESULT
    # ==================================================

    return {

        "risk_score": risk_score,

        "threat_level": threat_level,

        "threats": threats
    }


# ==================================================
# ANALYZE ALL PCAP FILES
# ==================================================

def analyze_all_pcaps():

    total_packets = 0

    total_bytes = 0

    icmp_count = 0

    ospf_count = 0

    tcp_count = 0

    udp_count = 0

    other_count = 0


    source_count = Counter()

    destination_count = Counter()

    individual_pcaps = []


    # ==================================================
    # PROCESS ALL PCAP FILES
    # ==================================================

    for filename in PCAP_FILES:

        file_path = PCAP_DIR / filename

        print(f"Checking: {file_path}")


        # ----------------------------------------------
        # CHECK FILE
        # ----------------------------------------------

        if not file_path.exists():

            print(f"WARNING: {filename} not found")

            continue


        # ----------------------------------------------
        # ANALYZE PCAP
        # ----------------------------------------------

        result = analyze_pcap(file_path)

        individual_pcaps.append(result)


        # ----------------------------------------------
        # ADD STATISTICS
        # ----------------------------------------------

        total_packets += result["total_packets"]

        total_bytes += result["total_bytes"]

        icmp_count += result["icmp"]

        ospf_count += result["ospf"]

        tcp_count += result["tcp"]

        udp_count += result["udp"]

        other_count += result["other"]


        # ----------------------------------------------
        # SOURCE / DESTINATION COUNTS
        # ----------------------------------------------

        source_count.update(
            result["top_source_ips"]
        )

        destination_count.update(
            result["top_destination_ips"]
        )


    # ==================================================
    # AI THREAT DETECTION
    # ==================================================

    threat_analysis = detect_threats({

        "total_packets": total_packets,

        "icmp": icmp_count,

        "tcp": tcp_count,

        "udp": udp_count
    })


    # ==================================================
    # FINAL RESULT
    # ==================================================

    return {

        "total_pcaps": len(individual_pcaps),

        "total_packets": total_packets,

        "total_bytes": total_bytes,

        "icmp": icmp_count,

        "ospf": ospf_count,

        "tcp": tcp_count,

        "udp": udp_count,

        "other": other_count,


        # ----------------------------------------------
        # AI THREAT INFORMATION
        # ----------------------------------------------

        "risk": threat_analysis["risk_score"],

        "threat": threat_analysis["threat_level"],

        "threats": threat_analysis["threats"],


        # ----------------------------------------------
        # IP INFORMATION
        # ----------------------------------------------

        "top_source_ips": dict(
            source_count.most_common(10)
        ),

        "top_destination_ips": dict(
            destination_count.most_common(10)
        ),


        # ----------------------------------------------
        # INDIVIDUAL PCAP DATA
        # ----------------------------------------------

        "pcaps": individual_pcaps,
    }


# ==================================================
# TRAFFIC API
# ==================================================

@app.get("/api/traffic")
def get_traffic():
    return analyze_all_pcaps()

# ==================================================
# ALERTS & STATE API
# ==================================================

@app.get("/api/alerts")
def api_get_alerts(open_only: bool = False):
    if open_only:
        return get_open_alerts()
    return get_recent_alerts(50)

@app.post("/api/alerts/clear")
def api_clear_alerts():
    from backend.database import clear_all_alerts
    clear_all_alerts()
    return {"status": "success"}

@app.get("/api/activity")
def api_get_activity():
    return get_recent_activities(30)

@app.get("/api/nodes")
def api_get_nodes():
    states = get_all_device_states()
    return list(states.values())


# ==================================================
# RUN DIRECTLY
# ==================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000
    )