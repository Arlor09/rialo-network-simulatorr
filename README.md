# Rialo Network Simulator

A real-time blockchain network simulator inspired by Rialo Network, focused on infrastructure behavior, real-world data execution, and automation logic.

This project is built as a **portfolio project** to explore how a modern blockchain infrastructure could handle real-time workloads, network stress, and adaptive execution layers without relying on wallet connections or on-chain deployment.

---

## Overview

Rialo Network Simulator visualizes the internal behavior of a high-performance blockchain network, including:

- Throughput (TPS)
- Network latency
- Validator health
- Execution cost (gas)
- Layer switching (L1 ↔ L2)

Instead of focusing on DeFi or token mechanics, this simulator emphasizes **infrastructure-level logic** and **real-world automation scenarios**, aligning with Rialo’s vision of real-time execution and developer-friendly systems.

---

## Project Goals

- Simulate realistic blockchain network behavior
- Demonstrate how real-world data bursts affect execution
- Visualize infrastructure stress and recovery
- Explore automation rules at the network level
- Build an infra-focused project suitable for technical portfolios

---

## Simulated Network Metrics

The values used in this simulator are **intentionally realistic**, not marketing-level benchmarks.

| Condition | TPS | Latency | Gas Cost | Layer |
|---------|-----|--------|----------|-------|
| Stable | ~2,000 | ~1.6 ms | ~1.2 RLO | L1 |
| Stress | ~3,200 | ~5.0 ms | ~3.0 RLO | L2 |
| Critical | ~1,400 | ~12 ms | ~4.5 RLO | Mixed |

---

## Simulation Scenarios

The simulator includes several predefined scenarios:

- **Normal Operation**  
  Baseline healthy network state.

- **Traffic Spike**  
  Increased transaction volume with moderate latency growth.

- **Real-World Data Surge**  
  Simulates IoT, AI inference, or Web2-to-Web3 data bursts that trigger adaptive execution and layer scaling.

- **DDoS / Anomalous Traffic**  
  Network degradation scenario with validator isolation and diagnostic triggers.

Each scenario dynamically updates metrics, logs, and network status.

---

## Automation Rules (Example)

The simulator applies simple rule-based automation to mimic infrastructure behavior:

```yaml

IF TPS > 2800:
  switch_layer: L2

IF latency > 5ms:
  throttle_non_critical_execution

IF failed_tx > 10%:
  trigger_network_diagnostics
```

## Design Decisions

This project intentionally avoids wallet connections and on-chain deployment.
The goal is to focus on infrastructure behavior, execution flow, and automation logic rather than user-facing crypto interactions.

All metrics are simulated based on realistic assumptions to enable controlled experimentation with network stress scenarios.

## Limitations

- Metrics are simulated and not backed by real blockchain execution
- Network behavior is simplified for visualization purposes
- Automation rules are static and deterministic
- Security and cryptographic details are out of scope

## Why This Project

I built this simulator to better understand how real-time blockchain infrastructure can handle real-world data bursts and automation at the network level.
This project reflects my interest in blockchain infrastructure rather than DeFi-oriented applications.

## Author

Arlor09
Interested in Machine Learning and Blockchain Infrastructure