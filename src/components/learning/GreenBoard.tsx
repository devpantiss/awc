// ============================================================
// GREEN BOARD - Interactive chalkboard canvas
// Drawing, writing, letters/numbers tracing, free draw
// ============================================================

import { useRef, useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import {
  Pencil, Eraser, Trash2, Download, Undo2,
  Minus, Plus, Circle, Square, Type,
  Palette, Maximize2, Minimize2,
} from 'lucide-react';

// Tracing guides
const TRACING_GUIDES: Record<string, { label: string; items: string[] }> = {
  'odia-vowels': { label: 'ଓଡ଼ିଆ ସ୍ୱରବର୍ଣ୍ଣ', items: ['ଅ', 'ଆ', 'ଇ', 'ଈ', 'ଉ', 'ଊ', 'ଏ', 'ଐ', 'ଓ', 'ଔ'] },
  'numbers': { label: 'Numbers 1-10', items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  'hindi-vowels': { label: 'हिन्दी स्वर', items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'] },
  'english': { label: 'English A-Z', items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] },
  'patterns': { label: 'Pre-Writing Patterns', items: ['|', '—', '/', '\\', '~', 'O', 'S', 'V', 'W', 'Z'] },
};

const CHALK_COLORS = [
  { name: 'Black', value: '#1a1a2e' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Yellow', value: '#FACC15' },
  { name: 'Pink', value: '#F472B6' },
  { name: 'Sky Blue', value: '#38BDF8' },
  { name: 'Orange', value: '#FB923C' },
  { name: 'Lime', value: '#A3E635' },
];

interface Point {
  x: number;
  y: number;
}

export function GreenBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme: appTheme } = useAppStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [chalkColor, setChalkColor] = useState(appTheme === 'dark' ? '#FFFFFF' : '#1a1a2e');
  const [brushSize, setBrushSize] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [guideChar, setGuideChar] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const lastPoint = useRef<Point | null>(null);

  // Sync with App Theme
  useEffect(() => {
    setChalkColor(appTheme === 'dark' ? '#FFFFFF' : '#1a1a2e');
  }, [appTheme]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Board background
    drawBoardBackground(ctx, rect.width, rect.height);
    saveState();
  }, [isFullscreen, appTheme]);

  const drawBoardBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    if (appTheme === 'dark') {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(0.5, '#1a1a2e');
      gradient.addColorStop(1, '#0f0f23');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.globalAlpha = 0.02;
      for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = '#333';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, w - 8, h - 8);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#e2e8f0'; 
      ctx.lineWidth = 2; 
      ctx.strokeRect(1, 1, w - 2, h - 2);
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-20), imageData]);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const newHistory = [...history];
    newHistory.pop();
    const prev = newHistory[newHistory.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory(newHistory);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawBoardBackground(ctx, rect.width, rect.height);
    setGuideChar(null);
    saveState();
  };

  // Draw tracing guide character
  const showTracingGuide = (char: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    // Clear and redraw background
    drawBoardBackground(ctx, rect.width, rect.height);

    // Draw the guide character (large, dotted, faint)
    ctx.save();
    ctx.font = `bold ${Math.min(rect.width, rect.height) * 0.45}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Faint dotted outline
    ctx.strokeStyle = appTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 8]);
    ctx.strokeText(char, rect.width / 2, rect.height / 2);
    ctx.setLineDash([]);

    // Very faint fill
    ctx.fillStyle = appTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,0.03)';
    ctx.fillText(char, rect.width / 2, rect.height / 2);

    // Guide text at top
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = appTheme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0,0,0,0.25)';
    ctx.fillText(`Trace the letter: ${char}`, rect.width / 2, 30);

    ctx.restore();
    setGuideChar(char);
    saveState();
  };

  // Drawing logic
  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    lastPoint.current = point;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getCanvasPoint(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);

    if (tool === 'eraser') {
      ctx.strokeStyle = appTheme === 'dark' ? '#1a1a2e' : '#FFFFFF';
      ctx.lineWidth = brushSize * 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.strokeStyle = chalkColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';

      // Chalk texture — slight randomness
      if (appTheme === 'dark') {
        ctx.shadowBlur = 1;
        ctx.shadowColor = chalkColor;
        ctx.globalAlpha = 0.85 + Math.random() * 0.15;
      } else {
        ctx.globalAlpha = 1;
      }
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    lastPoint.current = point;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPoint.current = null;
      saveState();
    }
  };

  // Download canvas as image
  const downloadBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `greenboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={cn(
      'flex flex-col gap-4 animate-fade-in',
      isFullscreen && 'fixed inset-0 z-50 bg-background p-4'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="text-2xl">{appTheme === 'dark' ? '⬛' : '⬜'}</span> {appTheme === 'dark' ? 'Black Board' : 'White Board'}
          </h3>
          <p className="text-xs text-muted-foreground">Interactive chalkboard for writing, tracing & drawing</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-card">
        {/* Tools */}
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <button
            onClick={() => setTool('pen')}
            className={cn('p-2 rounded-lg transition-all', tool === 'pen' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground hover:bg-accent')}
            title="Chalk"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={cn('p-2 rounded-lg transition-all', tool === 'eraser' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground hover:bg-accent')}
            title="Duster"
          >
            <Eraser size={18} />
          </button>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <button onClick={() => setBrushSize(Math.max(1, brushSize - 1))} className="p-1.5 rounded text-muted-foreground hover:bg-accent"><Minus size={14} /></button>
          <span className="text-xs font-mono font-medium w-6 text-center text-foreground">{brushSize}</span>
          <button onClick={() => setBrushSize(Math.min(12, brushSize + 1))} className="p-1.5 rounded text-muted-foreground hover:bg-accent"><Plus size={14} /></button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 border-r border-border pr-2">
          {CHALK_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => { setChalkColor(c.value); setTool('pen'); }}
              className={cn(
                'w-6 h-6 rounded-full border-2 transition-all hover:scale-110',
                chalkColor === c.value && tool === 'pen' ? 'border-foreground scale-110 ring-2 ring-emerald-400/50' : 'border-transparent'
              )}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        {/* Tracing Guides */}
        <div className="relative">
          <button
            onClick={() => setShowGuides(!showGuides)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5',
              showGuides ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-400' : 'border-border text-muted-foreground hover:bg-accent'
            )}
          >
            <Type size={14} /> Tracing Guides
          </button>
          {showGuides && (
            <div className="absolute top-full mt-2 left-0 z-20 w-72 max-h-80 overflow-auto p-3 rounded-xl border border-border bg-card shadow-xl animate-fade-in">
              {Object.entries(TRACING_GUIDES).map(([key, guide]) => (
                <div key={key} className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{guide.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.items.map(item => (
                      <button
                        key={item}
                        onClick={() => { showTracingGuide(item); setShowGuides(false); }}
                        className={cn(
                          'w-9 h-9 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all hover:scale-105',
                          guideChar === item
                            ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                            : 'border-border text-foreground hover:border-emerald-300'
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={undo} className="p-2 rounded-lg text-muted-foreground hover:bg-accent" title="Undo"><Undo2 size={16} /></button>
          <button onClick={clearBoard} className="p-2 rounded-lg text-muted-foreground hover:bg-red-100 dark:hover:bg-red-950/30 hover:text-red-600" title="Clear"><Trash2 size={16} /></button>
          <button onClick={downloadBoard} className="p-2 rounded-lg text-muted-foreground hover:bg-accent" title="Download"><Download size={16} /></button>
        </div>
      </div>

      {/* Canvas */}
      <div className={cn(
        'relative rounded-xl overflow-hidden shadow-2xl border-4 border-amber-900/60',
        isFullscreen ? 'flex-1' : 'aspect-[4/3]'
      )}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Chalk tray */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-amber-800/80 to-amber-900 flex items-center justify-center">
          <div className="w-16 h-2 rounded bg-white/80 shadow" />
          <div className="w-12 h-2 rounded bg-yellow-200/80 shadow ml-3" />
          <div className="w-10 h-2 rounded bg-pink-300/80 shadow ml-3" />
        </div>
      </div>

      {/* Active Guide Info */}
      {guideChar && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{guideChar}</span>
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Tracing Guide Active</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Trace over the dotted letter on the board. Use white chalk for best results.</p>
          </div>
        </div>
      )}
    </div>
  );
}
