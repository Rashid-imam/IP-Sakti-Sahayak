import { useEffect, useRef, useState } from 'react';
import { CircleHelp, Leaf, Plus, Search } from 'lucide-react';

type GraphNode = {
  id: string;
  name: string;
  type: string;
  color: string;
  r: number;
  center?: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type GraphLink = {
  source: string;
  target: string;
};

const LINKS: GraphLink[] = [
  { source: 'ashwagandha', target: 'traditional' },
  { source: 'ashwagandha', target: 'clinical' },
  { source: 'ashwagandha', target: 'formulations' },
  { source: 'ashwagandha', target: 'patents' },
];

function makeNodes(): GraphNode[] {
  return [
    {
      id: 'ashwagandha',
      name: 'Ashwagandha',
      type: 'Ingredient',
      color: '#245C3A',
      r: 26,
      center: true,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    },
    {
      id: 'traditional',
      name: 'Traditional uses',
      type: 'Knowledge',
      color: '#397153',
      r: 16,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    },
    {
      id: 'clinical',
      name: 'Clinical research',
      type: 'Research',
      color: '#28735A',
      r: 16,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    },
    {
      id: 'formulations',
      name: 'Herbal formulations',
      type: 'Formulation',
      color: '#D8892F',
      r: 16,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    },
    {
      id: 'patents',
      name: 'Patent records',
      type: 'IP',
      color: '#8B4A36',
      r: 16,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    },
  ];
}

export default function KnowledgeGraph() {
  const [search, setSearch] = useState('Ashwagandha');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>(makeNodes());
  const scaleRef = useRef(1);
  const draggingRef = useRef<GraphNode | null>(null);
  const hoveredRef = useRef<GraphNode | null>(null);
  const rafRef = useRef<number>();

  const layout = () => {
    const canvas = canvasRef.current;
    const holder = holderRef.current;

    if (!canvas || !holder) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = holder.clientWidth * dpr;
    canvas.height = holder.clientHeight * dpr;

    canvas.style.width = `${holder.clientWidth}px`;
    canvas.style.height = `${holder.clientHeight}px`;

    const ctx = canvas.getContext('2d');

    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = holder.clientWidth;
    const h = holder.clientHeight;

    const cx = w / 2;
    const cy = h / 2;

    const radius = Math.min(w, h) * 0.28;

    const nodes = nodesRef.current;

    nodes.forEach((n, i) => {
      if (n.center) {
        n.x = cx;
        n.y = cy;
      } else {
        const angle =
          ((i - 1) / (nodes.length - 1)) * Math.PI * 2;

        n.x = cx + Math.cos(angle) * radius;
        n.y = cy + Math.sin(angle) * radius;
      }

      n.vx = 0;
      n.vy = 0;
    });
  };

  const toLocal = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const holder = holderRef.current;

    if (!canvas || !holder) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    const w = holder.clientWidth;
    const h = holder.clientHeight;

    let x = clientX - rect.left;
    let y = clientY - rect.top;

    x =
      (x - w / 2) / scaleRef.current +
      w / 2;

    y =
      (y - h / 2) / scaleRef.current +
      h / 2;

    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const holder = holderRef.current;

    if (!canvas || !holder) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    layout();

    const handleResize = () => {
      layout();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseDown = (e: MouseEvent) => {
      const { x, y } = toLocal(
        e.clientX,
        e.clientY
      );

      draggingRef.current =
        nodesRef.current.find(
          (n) =>
            Math.hypot(
              n.x - x,
              n.y - y
            ) <
            n.r + 6
        ) || null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = toLocal(
        e.clientX,
        e.clientY
      );

      hoveredRef.current =
        nodesRef.current.find(
          (n) =>
            Math.hypot(
              n.x - x,
              n.y - y
            ) <
            n.r + 6
        ) || null;

      canvas.style.cursor =
        hoveredRef.current
          ? 'pointer'
          : 'default';

      if (draggingRef.current) {
        draggingRef.current.x = x;
        draggingRef.current.y = y;

        draggingRef.current.vx = 0;
        draggingRef.current.vy = 0;
      }
    };

    const handleMouseUp = () => {
      draggingRef.current = null;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      scaleRef.current = Math.min(
        2.2,
        Math.max(
          0.5,
          scaleRef.current -
            e.deltaY * 0.001
        )
      );
    };

    canvas.addEventListener(
      'mousedown',
      handleMouseDown
    );

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    window.addEventListener(
      'mouseup',
      handleMouseUp
    );

    canvas.addEventListener(
      'wheel',
      handleWheel,
      { passive: false }
    );

    const step = () => {
      const w = holder.clientWidth;
      const h = holder.clientHeight;

      const cx = w / 2;
      const cy = h / 2;

      const radius =
        Math.min(w, h) * 0.28;

      const nodes = nodesRef.current;

      nodes.forEach((n, i) => {
        if (n === draggingRef.current) {
          return;
        }

        const targetAngle = n.center
          ? 0
          : ((i - 1) /
              (nodes.length - 1)) *
            Math.PI *
            2;

        const tx = n.center
          ? cx
          : cx +
            Math.cos(
              targetAngle +
                performance.now() *
                  0.00006
            ) *
              radius;

        const ty = n.center
          ? cy
          : cy +
            Math.sin(
              targetAngle +
                performance.now() *
                  0.00006
            ) *
              radius;

        n.vx +=
          (tx - n.x) * 0.004;

        n.vy +=
          (ty - n.y) * 0.004;

        n.vx *= 0.9;
        n.vy *= 0.9;

        n.x += n.vx;
        n.y += n.vy;
      });
    };

    const draw = () => {
      const w = holder.clientWidth;
      const h = holder.clientHeight;

      const nodes = nodesRef.current;

      ctx.clearRect(0, 0, w, h);

      ctx.save();

      ctx.translate(w / 2, h / 2);

      ctx.scale(
        scaleRef.current,
        scaleRef.current
      );

      ctx.translate(
        -w / 2,
        -h / 2
      );

      // CONNECTIONS
      ctx.strokeStyle =
        'rgba(57,113,83,0.45)';

      ctx.lineWidth = 1.4;

      LINKS.forEach(
        ({ source, target }) => {
          const a = nodes.find(
            (n) => n.id === source
          );

          const b = nodes.find(
            (n) => n.id === target
          );

          if (!a || !b) return;

          ctx.beginPath();

          ctx.moveTo(a.x, a.y);

          ctx.lineTo(b.x, b.y);

          ctx.stroke();
        }
      );

      // NODES
      nodes.forEach((n) => {
        ctx.beginPath();

        ctx.fillStyle = n.color;

        ctx.arc(
          n.x,
          n.y,
          n.r,
          0,
          Math.PI * 2
        );

        ctx.fill();

        if (n === hoveredRef.current) {
          ctx.lineWidth = 3;

          ctx.strokeStyle =
            '#E5C98B';

          ctx.stroke();
        }

        ctx.fillStyle = '#245C3A';

        ctx.font = `${
          n.center
            ? '600 13px'
            : '600 11px'
        } Arial`;

        ctx.textAlign = 'center';

        ctx.fillText(
          n.name,
          n.x,
          n.y + n.r + 16
        );
      });

      ctx.restore();
    };

    const loop = () => {
      step();
      draw();

      rafRef.current =
        requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );

      canvas.removeEventListener(
        'mousedown',
        handleMouseDown
      );

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      window.removeEventListener(
        'mouseup',
        handleMouseUp
      );

      canvas.removeEventListener(
        'wheel',
        handleWheel
      );

      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current
        );
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    nodesRef.current[0].name =
      search || 'Ashwagandha';
  };

  const resetGraph = () => {
    scaleRef.current = 1;

    nodesRef.current = makeNodes();

    layout();
  };

  const zoomIn = () => {
    scaleRef.current = Math.min(
      2.2,
      scaleRef.current + 0.2
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1250px] px-4 pb-8 pt-6 sm:px-6 sm:pt-8">

      {/* PAGE HEADING */}

      <div className="mb-5 max-w-[950px]">

        <div className="mb-3 flex items-center gap-3">

          <span className="h-[2px] w-8 bg-[#D8892F]" />

          <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F]">
            Connected Knowledge
          </span>

        </div>

        <h1 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
          Research Explorer
        </h1>

        <p className="mt-3 max-w-[760px] text-base leading-7 text-[#607282]">
          Explore the relationships around an
          ingredient through an interactive
          3D knowledge graph.
        </p>

      </div>

      {/* MAIN GRAPH CONTAINER */}

      <div className="overflow-hidden rounded-xl border border-[#d9e3eb] bg-white shadow-[0_8px_30px_rgba(36,92,58,0.06)]">

        {/* TOOLBAR */}

        <div className="flex flex-col gap-3 border-b border-[#d9e3eb] p-4 sm:flex-row sm:items-center">

          <form
            onSubmit={handleSearch}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-[#d9e3eb] bg-[#F6F9F7] px-3 py-2"
          >

            <Search
              size={16}
              className="shrink-0 text-[#607282]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search the explorer"
              className="w-full border-0 bg-transparent text-sm text-[#17382A] outline-none placeholder:text-[#8a98a5]"
            />

            <button
              type="submit"
              className="hidden rounded-md bg-[#397153] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#245C3A] sm:block"
            >
              Search
            </button>

          </form>

          <button
            type="button"
            onClick={zoomIn}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d9e3eb] bg-white px-4 py-2 text-sm text-[#607282] transition hover:border-[#397153] hover:text-[#397153]"
            title="Use mouse wheel to zoom"
          >
            <Plus size={16} />
            Zoom
          </button>

          <button
            type="button"
            onClick={resetGraph}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d9e3eb] bg-white px-4 py-2 text-sm text-[#607282] transition hover:border-[#397153] hover:text-[#397153]"
          >
            <CircleHelp size={16} />
            Reset
          </button>

        </div>

        {/* CANVAS GRAPH */}

        <div
          ref={holderRef}
          className="relative h-[500px] w-full overflow-hidden bg-[#F0F7F2] sm:h-[560px] md:h-[620px]"
        >

          <canvas
            ref={canvasRef}
            className="block h-full w-full"
          />

          <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-white/70 bg-white/85 px-4 py-3 shadow-lg backdrop-blur-sm">

            <p className="text-xs font-semibold text-[#245C3A]">
              Interactive Explorer
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#607282]">
              Drag nodes to move · Scroll to zoom
            </p>

          </div>

        </div>

        {/* 5-COLOR LEGEND */}

        <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#d9e3eb] px-4 py-4 text-xs text-[#607282]">

          {/* Ingredient */}

          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#245C3A]" />
            Ingredient
          </span>

          {/* Knowledge */}

          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#397153]" />
            Knowledge
          </span>

          {/* Research */}

          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#28735A]" />
            Research
          </span>

          {/* Formulation */}

          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D8892F]" />
            Formulation
          </span>

          {/* IP */}

          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B4A36]" />
            IP &amp; Documents
          </span>

        </div>

      </div>

      {/* SMALL EXPLANATION */}

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#d9e3eb] bg-[#EAF4ED] p-4">

        <div className="mt-0.5 shrink-0 text-[#397153]">
          <Leaf size={18} />
        </div>

        <div>

          <h3 className="text-sm font-semibold text-[#245C3A]">
            Explore connections
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#607282]">
            Start from an ingredient and explore
            connected traditional knowledge,
            research, formulations and
            intellectual-property records.
          </p>

        </div>

      </div>

    </div>
  );
}