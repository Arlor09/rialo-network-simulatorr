import { NetworkMetrics, NetworkStatus, NetworkLayer } from "../types";

export async function analyzeNetworkState(
  metrics: NetworkMetrics,
  status: NetworkStatus,
  layer: NetworkLayer
): Promise<string> {
  const sentences: string[] = [];

  if (status === NetworkStatus.ATTACK) {
    sentences.push(
      `Anomalous ingress traffic detected consistent with a volumetric attack; isolate affected peers and enable aggressive rate-limiting at the edge.`
    );
    sentences.push(
      `Increase connection filtering and divert suspicious flows to a quarantine cluster; validate mempool integrity and replay-protect consensus messages.`
    );
    return sentences.slice(0, 3).join(' ');
  }

  if (status === NetworkStatus.STRESSED || status === NetworkStatus.CONGESTED || metrics.tps > 3000) {
    sentences.push(
      `Sustained high throughput and elevated latency detected; recommend offloading execution to L2 and increasing mempool capacity to reduce propagation delays.`
    );
    sentences.push(
      `Consider adaptive scheduling and temporary autoscaling of validator workers to restore service headroom.`
    );
    return sentences.slice(0, 3).join(' ');
  }

  sentences.push(
    `Network metrics are within expected bounds; minor tuning: smooth transaction admission to avoid short bursts and monitor propagation variance.`
  );
  sentences.push(`No immediate remediation required.`);
  return sentences.slice(0, 3).join(' ');
}
