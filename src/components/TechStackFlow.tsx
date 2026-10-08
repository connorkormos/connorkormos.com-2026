import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Handle,
  NodeToolbar,
  Position,
  applyEdgeChanges,
  applyNodeChanges,
  // Background,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
  // type CoordinateExtent,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { techStackSources } from "../lib/TechStackSources";

import "./TechStackFlow.css";
import "../App.css";

type TechStackData = {
  label?: React.ReactNode;
  yearsExperience?: number;
  name?: string;
};

type TechStackNode = Node<TechStackData>;

// const nodeExtent: CoordinateExtent = [
//   [-200, -225],
//   [250, 250],
// ];

export default function TechStackFlow() {

  const isMobile = window.innerWidth <= 768;

  const onNodesChange = useCallback(
    (changes: NodeChange<TechStackNode>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const techStackNodeLabel = (techStackItem: { name: string; src: string }) => (
    <div className="techStackNodeContent">
      <img
        src={techStackItem.src}
        alt={techStackItem.name}
        style={{
          height: '100%',
          width: '100%',
          // width: "40px",
          // height: "40px",
          filter:
            techStackItem.name === "Flask" ||
              techStackItem.name === "SQLAlchemy"
              ? "brightness(0) invert(1)"
              : "none",
        }}

      // style={{width: "40px", height: "40px" }}
      />
      <Handle id="top" type="source" position={Position.Top} />
      <Handle id="top" type="target" position={Position.Top} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="bottom" type="target" position={Position.Bottom} />
      <Handle id="left" type="source" position={Position.Left} />
      <Handle id="left" type="target" position={Position.Left} />
      <Handle id="right" type="source" position={Position.Right} />
      <Handle id="right" type="target" position={Position.Right} />
    </div>
  );
  {
  }
  const initialNodes: TechStackNode[] = [
    {
      id: "javaScript",
      position: { x: -300, y: -300 },
      data: {
        label: techStackNodeLabel(techStackSources.javaScript),
      },
    },
    {
      id: "typeScript",
      position: { x: -125, y: -275 },
      data: {
        label: techStackNodeLabel(techStackSources.typeScript),
      },
    },
    {
      id: "html",
      position: { x: 125, y: -275 },
      data: {
        label: techStackNodeLabel(techStackSources.html),
      },
    },
    {
      id: "css",
      position: { x: 300, y: -300 },
      data: {
        label: techStackNodeLabel(techStackSources.css),
      },
    },
    {
      id: "reactRouter",
      position: { x: -220, y: -175 },
      data: {
        label: techStackNodeLabel(techStackSources.reactRouter),
      },
    },
    {
      id: "react",
      position: { x: 0, y: -125 },
      data: {
        label: techStackNodeLabel(techStackSources.react),
      },
    },
    {
      id: "redux",
      position: { x: 220, y: -175 },
      data: {
        label: techStackNodeLabel(techStackSources.redux),
      },
    },
    {
      id: "python",
      position: { x: -175, y: -25 },
      data: {
        label: techStackNodeLabel(techStackSources.python),
      },
    },
    {
      id: "flask",
      position: { x: 0, y: 25 },
      data: {
        label: techStackNodeLabel(techStackSources.flask),
      },
    },
    {
      id: "sqlAlchemy",
      position: { x: 175, y: -25 },
      data: {
        label: techStackNodeLabel(techStackSources.sqlAlchemy),
      },
    },
    {
      id: "postgres",
      position: { x: 0, y: 175 },
      data: {},
    },
  ];

  initialNodes.forEach((node) => {
    node.className = "reactFlowTechNode";
    node.data.label = techStackNodeLabel(
      techStackSources[node.id as keyof typeof techStackSources],
    );
    if (!node.style) {
      node.style = { width: 70, height: 70, padding: 10 };
    }
    node.data.yearsExperience =
      techStackSources[
        node.id as keyof typeof techStackSources
      ]?.yearsExperience;
    node.data.name =
      techStackSources[
        node.id as keyof typeof techStackSources
      ]?.name;
    node.type = "default";
  });

  const createEdge = (
    source: string,
    target: string,
    fromSide: "left" | "right" | "top" | "bottom",
    toSide: "left" | "right" | "top" | "bottom",
    label?: string,
  ) => {
    return {
      id: `${source}-${target}`,
      source: source,
      sourceHandle: fromSide,
      target: target,
      targetHandle: toSide,
      label: label,
    };
  };

  const initialEdges: Edge[] = [
    createEdge("javaScript", "typeScript", "right", "left"),
    createEdge("typeScript", "react", "right", "top"),
    createEdge("html", "react", "left", "top"),
    createEdge("css", "html", "left", "right"),
    createEdge("reactRouter", "react", "right", "left"),
    createEdge("redux", "react", "left", "right"),
    createEdge("react", "flask", "bottom", "top"),
    createEdge("python", "flask", "right", "left"),
    createEdge("sqlAlchemy", "flask", "left", "right"),
    createEdge("flask", "postgres", "bottom", "top"),
  ];

  initialEdges.forEach((edge) => {
    // edge.type = "smoothstep";
    edge.animated = true;
    edge.style = { stroke: "var(--color-main-lighter)" };
  });
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [hoveredTech, setHoveredTech] = useState<TechStackNode | null>(null);


  const flowRef = useRef<ReactFlowInstance<TechStackNode, Edge> | null>(null);

  useEffect(() => {
    let frameId = 0;

    const recenter = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const flow = flowRef.current;
        if (!flow) return;

        const zoom = flow.getZoom();
        void flow.fitView({ minZoom: zoom, maxZoom: zoom });
      });
    };

    window.addEventListener("resize", recenter);

    return () => {
      window.removeEventListener("resize", recenter);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="mainContentContainer techStackContainer">
      {/* <h1 style={{ margin: "auto", textAlign: "center" }}> */}
      <h1 className="titleSecondary">
        Primary Tech Stack
      </h1>
      {/* <div style={{height: "45rem", width: "auto" }}> */}
      {/* <div style={{height: 'clamp(10vh, 45rem, 90vh)', width: 'clamp(50%, 45rem, 90%)', margin: 'auto'}}> */}
      <div style={{ width: '100%', height: `clamp(10vh, ${isMobile ? '25rem' : '55rem'}, 75vh)`, position: 'relative', margin: 'auto', }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeMouseEnter={(_event, node) => setHoveredTech(node)}
          onNodeMouseLeave={() => setHoveredTech(null)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          // nodeExtent={nodeExtent}
          onInit={(instance) => {
            flowRef.current = instance;
          }}
          fitView
          nodesDraggable={!isMobile}
          panOnScroll={false}
          zoomOnScroll={false}
          preventScrolling={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          autoPanOnNodeDrag={false}
          // autoPanOnNodeDrag={false}
          // autoPanOnConnect={false}
          // zoomOnPinch={false}
          colorMode="system"
          className="reactFlowElement"
        >
          {hoveredTech && (
            <NodeToolbar
              nodeId={hoveredTech.id}
              isVisible
              position={Position.Bottom}
              offset={12}
            >
              <div className="techExperiencePopup" role="tooltip">
                <p>{hoveredTech.data.name}</p>
                <p>
                  {hoveredTech.data.yearsExperience}{" "}
                  {hoveredTech.data.yearsExperience === 1 ? "Year" : "Years"}{" "}
                  Experience
                </p>
              </div>
            </NodeToolbar>
          )}
          {/* <div
            style={{ position: "absolute", bottom: 10, right: 10, zIndex: 4 }}
          >
            <button
              onClick={() => {
                setNodes(initialNodes);
                setEdges(initialEdges);
              }}
            >
              Reset Flow
            </button>
          </div> */}
          {/* <Background style={{background: 'transparent'}} /> */}
          {/* <Controls /> */}
        </ReactFlow>
      </div>
    </div>
  );
}
