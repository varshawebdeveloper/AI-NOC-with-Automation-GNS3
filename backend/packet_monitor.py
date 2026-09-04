from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scapy.all import rdpcap, IP, ICMP, TCP, UDP
from collections import Counter
from pathlib import Path


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

    for packet in packets:

        total_bytes += len(packet)

        if IP not in packet:
            other_count += 1
            continue

        source = packet[IP].src
        destination = packet[IP].dst

        source_count[source] += 1
        destination_count[destination] += 1

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

    for filename in PCAP_FILES:

        file_path = PCAP_DIR / filename

        print(f"Checking: {file_path}")

        if not file_path.exists():

            print(f"WARNING: {filename} not found")

            continue

        result = analyze_pcap(file_path)

        individual_pcaps.append(result)

        total_packets += result["total_packets"]
        total_bytes += result["total_bytes"]

        icmp_count += result["icmp"]
        ospf_count += result["ospf"]
        tcp_count += result["tcp"]
        udp_count += result["udp"]
        other_count += result["other"]

        source_count.update(
            result["top_source_ips"]
        )

        destination_count.update(
            result["top_destination_ips"]
        )


    # ==================================================
    # RISK ANALYSIS
    # ==================================================

    risk_score = 0

    if icmp_count > 20:
        risk_score += 30

    if tcp_count > 50:
        risk_score += 30

    if udp_count > 50:
        risk_score += 20


    if risk_score >= 70:
        threat_level = "HIGH"

    elif risk_score >= 40:
        threat_level = "MEDIUM"

    else:
        threat_level = "LOW"


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

        "risk": risk_score,

        "threat": threat_level,

        "top_source_ips": dict(
            source_count.most_common(10)
        ),

        "top_destination_ips": dict(
            destination_count.most_common(10)
        ),

        "pcaps": individual_pcaps,
    }


# ==================================================
# TRAFFIC API
# ==================================================

@app.get("/api/traffic")
def get_traffic():

    return analyze_all_pcaps()


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