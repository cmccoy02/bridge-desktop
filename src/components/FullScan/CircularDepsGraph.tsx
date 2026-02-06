import { useEffect, useRef } from 'react'
import { DataSet, Network } from 'vis-network/standalone'
import type { Edge, Node } from 'vis-network'
import type { CircularDependency } from '../../types'

interface CircularDepsGraphProps {
  dependencies: CircularDependency[]
}

export default function CircularDepsGraph({ dependencies }: CircularDepsGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const networkRef = useRef<Network | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const nodeSet = new Set<string>()
    const edges: Edge[] = []

    for (const dep of dependencies) {
      nodeSet.add(dep.from)
      nodeSet.add(dep.to)
      edges.push({
        id: `${dep.from}->${dep.to}`,
        from: dep.from,
        to: dep.to,
        arrows: 'to',
        color: { color: 'rgba(245, 167, 0, 0.6)' }
      })
    }

    const nodes = new DataSet<Node>(
      Array.from(nodeSet).map(node => ({
        id: node,
        label: node.split('/').pop() || node,
        title: node,
        shape: 'dot'
      }))
    )

    const edgeData = new DataSet<Edge>(edges)

    if (!networkRef.current) {
      networkRef.current = new Network(
        containerRef.current,
        { nodes, edges: edgeData },
        {
          autoResize: true,
          nodes: {
            color: {
              background: 'rgba(245, 167, 0, 0.2)',
              border: 'rgba(245, 167, 0, 0.7)'
            },
            font: { color: 'var(--text-primary)' },
            size: 16
          },
          edges: { smooth: true },
          physics: {
            stabilization: false,
            barnesHut: { springLength: 140, springConstant: 0.03 }
          },
          interaction: { hover: true }
        }
      )
    } else {
      networkRef.current.setData({ nodes, edges: edgeData })
    }

    return () => {
      networkRef.current?.destroy()
      networkRef.current = null
    }
  }, [dependencies])

  return <div className="graph-container" ref={containerRef} />
}
