// ============================================================
// ENTERPRISE GREEN BOARD PAGE
// Full-featured interactive digital chalkboard for ed-tech
// Features: Multi-board themes, drawing tools, shapes, text,
// stamps, tracing guides, teaching tools, multi-page, zoom
// ============================================================

import { useRef, useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils';
import {
  Pencil, Eraser, Trash2, Download, Undo2, Redo2,
  Minus, Plus, Type, Maximize2, Minimize2,
  Circle as CircleIcon, Square, ArrowUpRight, Highlighter,
  Sticker, MousePointer, StickyNote, Grid3X3,
  ChevronLeft, ChevronRight, Timer, Dices, Ruler,
  Users, Star, Check, Heart, ThumbsUp, Smile,
  X, Image, Palette, ZoomIn, ZoomOut, Move,
  Hand, PenTool, Layers, FileText, BookOpen,
  RotateCcw,
} from 'lucide-react';

// ---- TYPES ----
type Tool = 'pen' | 'highlighter' | 'eraser' | 'text' | 'shape' | 'stamp' | 'select' | 'laser' | 'move';
type ShapeType = 'circle' | 'rectangle' | 'line' | 'arrow' | 'triangle' | 'star';
type BoardTheme = 'green' | 'white' | 'black' | 'grid' | 'lined' | 'dotted';
type StampType = 'star' | 'check' | 'heart' | 'thumbsup' | 'smiley' | 'trophy';

interface Point { x: number; y: number; }

interface BoardPage {
  id: number;
  name: string;
  imageData: ImageData | null;
}

// ---- CONSTANTS ----
const CHALK_COLORS = [
  { name: 'board.color.black', value: '#1a1a2e' },
  { name: 'board.color.white', value: '#FFFFFF' },
  { name: 'board.color.yellow', value: '#FACC15' },
  { name: 'board.color.pink', value: '#F472B6' },
  { name: 'board.color.blue', value: '#38BDF8' },
  { name: 'board.color.orange', value: '#FB923C' },
  { name: 'board.color.lime', value: '#A3E635' },
  { name: 'board.color.red', value: '#EF4444' },
  { name: 'board.color.violet', value: '#A78BFA' },
];

const BOARD_THEMES: { id: BoardTheme; name: string; bg: string; defaultPen: string; icon: string }[] = [
  { id: 'green', name: 'green_board', bg: '#1e5631', defaultPen: '#FFFFFF', icon: '🟩' },
  { id: 'black', name: 'black_board', bg: '#1a1a2e', defaultPen: '#FFFFFF', icon: '⬛' },
  { id: 'white', name: 'white_board', bg: '#FFFFFF', defaultPen: '#1a1a2e', icon: '⬜' },
  { id: 'grid', name: 'graph_paper', bg: '#FAFBFC', defaultPen: '#1a1a2e', icon: '📐' },
  { id: 'lined', name: 'ruled_paper', bg: '#FFFEF5', defaultPen: '#1a1a2e', icon: '📝' },
  { id: 'dotted', name: 'dotted_grid', bg: '#F8FAFC', defaultPen: '#334155', icon: '🔵' },
];

const STAMPS: { id: StampType; emoji: string; label: string }[] = [
  { id: 'star', emoji: '⭐', label: 'board.stamps.star' },
  { id: 'check', emoji: '✅', label: 'board.stamps.correct' },
  { id: 'heart', emoji: '❤️', label: 'board.stamps.love' },
  { id: 'thumbsup', emoji: '👍', label: 'board.stamps.good' },
  { id: 'smiley', emoji: '😊', label: 'board.stamps.happy' },
  { id: 'trophy', emoji: '🏆', label: 'board.stamps.winner' },
];

const TRACING_GUIDES: Record<string, { label: string; items: string[] }> = {
  'odia-vowels': { label: 'board.tracing.odia_vowels', items: ['ଅ', 'ଆ', 'ଇ', 'ଈ', 'ଉ', 'ଊ', 'ଏ', 'ଐ', 'ଓ', 'ଔ'] },
  'odia-consonants': { label: 'board.tracing.odia_consonants', items: ['କ', 'ଖ', 'ଗ', 'ଘ', 'ଙ', 'ଚ', 'ଛ', 'ଜ', 'ଝ', 'ଞ'] },
  'hindi-vowels': { label: 'board.tracing.hindi_vowels', items: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'] },
  'hindi-consonants': { label: 'board.tracing.hindi_consonants', items: ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ'] },
  'english-upper': { label: 'board.tracing.english_upper', items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'] },
  'english-lower': { label: 'board.tracing.english_lower', items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'] },
  'numbers': { label: 'board.tracing.numbers', items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] },
  'shapes': { label: 'board.tracing.shapes', items: ['○', '□', '△', '◇', '☆', '♡'] },
  'patterns': { label: 'board.tracing.patterns', items: ['|', '—', '/', '\\', '∿', 'O', 'S', 'Z', 'V', 'W'] },
};

// ---- COMPONENT ----
export function GreenBoardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme: appTheme } = useAppStore();
  const { t } = useTranslation();

  // Core state
  const [tool, setTool] = useState<Tool>('pen');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(appTheme === 'dark' ? 'black' : 'white');
  const [chalkColor, setChalkColor] = useState(appTheme === 'dark' ? '#FFFFFF' : '#1a1a2e');
  const [brushSize, setBrushSize] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [guideChar, setGuideChar] = useState<string | null>(null);

  // History
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Multi-page
  // Multi-page
  const [pages, setPages] = useState<BoardPage[]>([{ id: 1, name: `${t('page')} 1`, imageData: null }]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);

  // Shape drawing
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [shapeStart, setShapeStart] = useState<Point | null>(null);
  const [preShapeImage, setPreShapeImage] = useState<ImageData | null>(null);

  // Stamp
  const [selectedStamp, setSelectedStamp] = useState<StampType>('star');

  // Teaching tools
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [showPicker, setShowPicker] = useState(false);

  // Panels
  const [showTracingPanel, setShowTracingPanel] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showStampPanel, setShowStampPanel] = useState(false);
  const [showTeachingTools, setShowTeachingTools] = useState(false);
  const [showShapePanel, setShowShapePanel] = useState(false);

  // Drawing
  const lastPoint = useRef<Point | null>(null);

  // Mock student list for random picker
  const students = ['Aarav Sahoo', 'Diya Mohanty', 'Rohan Pradhan', 'Meera Behera', 'Kabir Das', 'Ananya Mishra', 'Ishaan Nayak', 'Pooja Swain'];

  // ---- BOARD BACKGROUND ----
  const drawBoardBackground = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, theme?: BoardTheme) => {
    const t = theme || boardTheme;
    const themeConfig = BOARD_THEMES.find(bt => bt.id === t)!;

    if (t === 'green') {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#1a472a');
      gradient.addColorStop(0.5, '#1e5631');
      gradient.addColorStop(1, '#1a472a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 3000; i++) { ctx.fillStyle = '#fff'; ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
      ctx.globalAlpha = 1;
      // Wooden frame
      ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 10; ctx.strokeRect(5, 5, w - 10, h - 10);
      ctx.strokeStyle = '#8B5E3C'; ctx.lineWidth = 3; ctx.strokeRect(10, 10, w - 20, h - 20);
    } else if (t === 'black') {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(0.5, '#1a1a2e');
      gradient.addColorStop(1, '#0f0f23');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.02;
      for (let i = 0; i < 2000; i++) { ctx.fillStyle = '#fff'; ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#333'; ctx.lineWidth = 8; ctx.strokeRect(4, 4, w - 8, h - 8);
    } else if (t === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, w - 2, h - 2);
    } else if (t === 'grid') {
      ctx.fillStyle = '#FAFBFC';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#dbeafe'; ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 150) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 150) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    } else if (t === 'lined') {
      ctx.fillStyle = '#FFFEF5';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#bfdbfe'; ctx.lineWidth = 1;
      for (let y = 60; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 20, y); ctx.stroke(); }
      ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(70, 20); ctx.lineTo(70, h - 20); ctx.stroke();
    } else if (t === 'dotted') {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#cbd5e1';
      for (let x = 20; x < w; x += 25) {
        for (let y = 20; y < h; y += 25) { ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill(); }
      }
    }
  }, [boardTheme]);

  // Sync with App Theme
  useEffect(() => {
    const newTheme = appTheme === 'dark' ? 'black' : 'white';
    setBoardTheme(newTheme);
    setChalkColor(appTheme === 'dark' ? '#FFFFFF' : '#1a1a2e');
  }, [appTheme]);

  // ---- CANVAS INIT ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    // Draw current page or background
    if (pages[currentPageIdx]?.imageData) {
       ctx.putImageData(pages[currentPageIdx].imageData!, 0, 0);
    } else {
       drawBoardBackground(ctx, rect.width, rect.height);
    }
    saveState();
  }, [isFullscreen, boardTheme]);

  // ---- THEME CHANGE ----
  const changeTheme = (theme: BoardTheme) => {
    const themeConfig = BOARD_THEMES.find(t => t.id === theme)!;
    setBoardTheme(theme);
    setChalkColor(themeConfig.defaultPen);
    // Redraw background
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawBoardBackground(ctx, rect.width, rect.height, theme);
    setGuideChar(null);
    saveState();
    setShowThemePanel(false);
  };

  // ---- HISTORY ----
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-30), imageData]);
    setRedoStack([]);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoStack.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const newUndo = [...undoStack];
    const current = newUndo.pop()!;
    setRedoStack(prev => [...prev, current]);
    const prev = newUndo[newUndo.length - 1];
    ctx.putImageData(prev, 0, 0);
    setUndoStack(newUndo);
  };

  const redo = () => {
    const canvas = canvasRef.current;
    if (!canvas || redoStack.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const newRedo = [...redoStack];
    const next = newRedo.pop()!;
    ctx.putImageData(next, 0, 0);
    setUndoStack(prev => [...prev, next]);
    setRedoStack(newRedo);
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

  // ---- TRACING GUIDES ----
  const showTracingGuide = (char: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawBoardBackground(ctx, rect.width, rect.height);

    ctx.save();
    const fontSize = Math.min(rect.width, rect.height) * 0.5;
    ctx.font = `bold ${fontSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Dotted outline
    ctx.strokeStyle = boardTheme === 'green' || boardTheme === 'black' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 10]);
    ctx.strokeText(char, rect.width / 2, rect.height / 2);
    ctx.setLineDash([]);
    // Faint fill
    ctx.fillStyle = boardTheme === 'black' || boardTheme === 'green' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
    ctx.fillText(char, rect.width / 2, rect.height / 2);
    // Guide text
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillStyle = boardTheme === 'black' || boardTheme === 'green' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)';
    ctx.fillText(t('board.tracing.trace_message', { char }), rect.width / 2, 30);
    ctx.restore();

    setGuideChar(char);
    setShowTracingPanel(false);
    saveState();
  };

  // ---- DRAWING ----
  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate relationship between physical canvas pixels and CSS pixels
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    // Apply scale to accurately determine context coordinate space
    return { 
      x: ((clientX - rect.left) * scaleX) / dpr, 
      y: ((clientY - rect.top) * scaleY) / dpr 
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);

    if (tool === 'stamp') {
      placeStamp(point);
      return;
    }
    if (tool === 'text') {
      placeText(point);
      return;
    }
    if (tool === 'shape') {
      setShapeStart(point);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) setPreShapeImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
    }

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

    if (tool === 'shape' && shapeStart && preShapeImage) {
      // Restore and preview shape
      ctx.putImageData(preShapeImage, 0, 0);
      drawShape(ctx, shapeStart, point);
      lastPoint.current = point;
      return;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);

    if (tool === 'eraser') {
      const themeConfig = BOARD_THEMES.find(t => t.id === boardTheme)!;
      ctx.strokeStyle = themeConfig.bg;
      ctx.lineWidth = brushSize * 8;
      ctx.globalCompositeOperation = 'source-over';
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = chalkColor;
      ctx.lineWidth = brushSize * 4;
      ctx.globalAlpha = 0.3;
    } else {
      ctx.strokeStyle = chalkColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = (boardTheme === 'green' || boardTheme === 'black') ? 0.85 + Math.random() * 0.15 : 1;
      if (boardTheme === 'green' || boardTheme === 'black') {
        ctx.shadowBlur = 1;
        ctx.shadowColor = chalkColor;
      }
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    lastPoint.current = point;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPoint.current = null;
      setShapeStart(null);
      setPreShapeImage(null);
      saveState();
    }
  };

  // ---- SHAPES ----
  const drawShape = (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    ctx.strokeStyle = chalkColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    const w = end.x - start.x;
    const h = end.y - start.y;

    switch (shapeType) {
      case 'rectangle':
        ctx.strokeRect(start.x, start.y, w, h);
        break;
      case 'circle': {
        const rx = Math.abs(w) / 2;
        const ry = Math.abs(h) / 2;
        const cx = start.x + w / 2;
        const cy = start.y + h / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 'line':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;
      case 'arrow':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = 15;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      case 'triangle':
        ctx.moveTo(start.x + w / 2, start.y);
        ctx.lineTo(start.x, end.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'star': {
        const cx2 = start.x + w / 2;
        const cy2 = start.y + h / 2;
        const outer = Math.min(Math.abs(w), Math.abs(h)) / 2;
        const inner = outer * 0.4;
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outer : inner;
          const a = (Math.PI / 2) * -1 + (i * Math.PI) / 5;
          const px = cx2 + r * Math.cos(a);
          const py = cy2 + r * Math.sin(a);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        break;
      }
    }
  };

  // ---- STAMPS ----
  const placeStamp = (point: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const stamp = STAMPS.find(s => s.id === selectedStamp);
    if (!stamp) return;
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stamp.emoji, point.x, point.y);
    saveState();
  };

  // ---- TEXT ----
  const placeText = (point: Point) => {
    const text = prompt(t('enter_text'));
    if (!text) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = `${brushSize * 6 + 12}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = chalkColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, point.x, point.y);
    saveState();
  };

  // ---- MULTI-PAGE ----
  const saveCurrentPage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setPages(prev => prev.map((p, i) => i === currentPageIdx ? { ...p, imageData } : p));
  };

  const goToPage = (idx: number) => {
    saveCurrentPage();
    setCurrentPageIdx(idx);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const page = pages[idx];
    if (page.imageData) {
      ctx.putImageData(page.imageData, 0, 0);
    } else {
      const rect = canvas.getBoundingClientRect();
      drawBoardBackground(ctx, rect.width, rect.height);
    }
  };

  const addPage = () => {
    saveCurrentPage();
    const newPage: BoardPage = { id: pages.length + 1, name: `${t('page')} ${pages.length + 1}`, imageData: null };
    setPages(prev => [...prev, newPage]);
    setCurrentPageIdx(pages.length);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawBoardBackground(ctx, rect.width, rect.height);
    saveState();
  };

  // ---- TIMER ----
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) {
      if (timerSeconds <= 0) setTimerRunning(false);
      return;
    }
    const interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const rollDice = () => setDiceValue(Math.floor(Math.random() * 6) + 1);
  const pickStudent = () => {
    setShowPicker(true);
    // Animate through names
    let count = 0;
    const maxCount = 15 + Math.floor(Math.random() * 10);
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * students.length));
      count++;
      if (count >= maxCount) clearInterval(interval);
    }, 100);
  };

  // ---- DOWNLOAD ----
  const downloadBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `board-page${currentPageIdx + 1}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // ---- CURSOR ----
  const getCursor = () => {
    switch (tool) {
      case 'pen': case 'highlighter': return 'crosshair';
      case 'eraser': return 'cell';
      case 'text': return 'text';
      case 'stamp': return 'pointer';
      case 'shape': return 'crosshair';
      case 'move': return 'grab';
      default: return 'default';
    }
  };

  const closeAllPanels = () => {
    setShowTracingPanel(false);
    setShowThemePanel(false);
    setShowStampPanel(false);
    setShowTeachingTools(false);
    setShowShapePanel(false);
  };

  const currentTheme = BOARD_THEMES.find(t => t.id === boardTheme)!;
  const isDark = boardTheme === 'green' || boardTheme === 'black';

  return (
    <div className={cn(
      'flex flex-col h-full animate-fade-in',
      isFullscreen && 'fixed inset-0 z-50 bg-background'
    )}>
      {/* ======== PAGE HEADER ======== */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PenTool size={20} className="text-emerald-600 dark:text-emerald-400" />
            {boardTheme === 'black' ? t('black_board') : t('white_board')}
          </h2>
          <p className="text-xs text-muted-foreground">{t('board.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Page Navigator */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg px-2 py-1">
            <button
              onClick={() => currentPageIdx > 0 && goToPage(currentPageIdx - 1)}
              disabled={currentPageIdx === 0}
              className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-semibold text-foreground min-w-[60px] text-center">{currentPageIdx + 1} / {pages.length}</span>
            <button
              onClick={() => currentPageIdx < pages.length - 1 ? goToPage(currentPageIdx + 1) : addPage()}
              className="p-1 rounded text-muted-foreground hover:text-foreground"
            >
              <ChevronRight size={14} />
            </button>
            <button onClick={addPage} className="p-1 rounded text-muted-foreground hover:text-emerald-600 ml-1" title={t('board.new_page')}>
              <Plus size={14} />
            </button>
          </div>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground" title={isFullscreen ? t('board.exit_fullscreen') : t('board.fullscreen')}>
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* ======== MAIN TOOLBAR ======== */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl border border-border bg-card mb-3">
        {/* Drawing Tools */}
        <ToolGroup label={t('board.labels.draw')}>
          <ToolButton icon={Pencil} active={tool === 'pen'} onClick={() => { setTool('pen'); closeAllPanels(); }} tip={t('board.tool.pen')} />
          <ToolButton icon={Highlighter} active={tool === 'highlighter'} onClick={() => { setTool('highlighter'); closeAllPanels(); }} tip={t('board.tool.highlighter')} />
          <ToolButton icon={Eraser} active={tool === 'eraser'} onClick={() => { setTool('eraser'); closeAllPanels(); }} tip={t('board.tool.eraser')} />
        </ToolGroup>

        <Divider />

        {/* Shape + Text + Stamp */}
        <ToolGroup label={t('board.labels.insert')}>
          <div className="relative">
            <ToolButton icon={Square} active={tool === 'shape'} onClick={() => { setTool('shape'); setShowShapePanel(!showShapePanel); setShowStampPanel(false); }} tip={t('board.tool.shapes')} />
            {showShapePanel && (
              <Dropdown>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">{t('board.tool.shapes')}</p>
                <div className="grid grid-cols-3 gap-1">
                  {([['rectangle', '▭'], ['circle', '○'], ['triangle', '△'], ['line', '—'], ['arrow', '→'], ['star', '☆']] as [ShapeType, string][]).map(([s, icon]) => (
                    <button key={s} onClick={() => { setShapeType(s); setShowShapePanel(false); }}
                      className={cn('p-2 rounded-lg text-center text-lg border-2 transition-all', shapeType === s ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' : 'border-border hover:border-emerald-300')}>
                      {icon}
                    </button>
                  ))}
                </div>
              </Dropdown>
            )}
          </div>
          <ToolButton icon={Type} active={tool === 'text'} onClick={() => { setTool('text'); closeAllPanels(); }} tip={t('board.tool.text')} />
          <div className="relative">
            <ToolButton icon={Sticker} active={tool === 'stamp'} onClick={() => { setTool('stamp'); setShowStampPanel(!showStampPanel); setShowShapePanel(false); }} tip={t('board.tool.stamps')} />
            {showStampPanel && (
              <Dropdown>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">{t('board.stamps.reward')}</p>
                <div className="grid grid-cols-3 gap-1">
                  {STAMPS.map(s => (
                    <button key={s.id} onClick={() => { setSelectedStamp(s.id); setShowStampPanel(false); }}
                      className={cn('p-2 rounded-lg text-center text-2xl border-2 transition-all', selectedStamp === s.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' : 'border-border hover:border-emerald-300')}>
                      {s.emoji}
                    </button>
                  ))}
                </div>
              </Dropdown>
            )}
          </div>
        </ToolGroup>

        <Divider />

        {/* Brush Size */}
        <ToolGroup label={t('board.tool.size')}>
          <button onClick={() => setBrushSize(Math.max(1, brushSize - 1))} className="p-1.5 rounded hover:bg-accent text-muted-foreground"><Minus size={12} /></button>
          <div className="flex items-center justify-center w-8">
            <div className="rounded-full bg-foreground" style={{ width: Math.min(brushSize * 2 + 2, 20), height: Math.min(brushSize * 2 + 2, 20) }} />
          </div>
          <button onClick={() => setBrushSize(Math.min(16, brushSize + 1))} className="p-1.5 rounded hover:bg-accent text-muted-foreground"><Plus size={12} /></button>
        </ToolGroup>

        <Divider />

        {/* Colors */}
        <ToolGroup label={t('board.tool.color')}>
          <div className="flex items-center gap-1 flex-wrap">
            {CHALK_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => { setChalkColor(c.value); if (tool === 'eraser') setTool('pen'); }}
                className={cn(
                  'w-6 h-6 rounded-full border-2 transition-all hover:scale-110',
                  chalkColor === c.value ? 'border-foreground scale-110 ring-2 ring-emerald-400/50 ring-offset-1 ring-offset-card' : 'border-transparent'
                )}
                style={{ backgroundColor: c.value, boxShadow: c.value === '#FFFFFF' ? 'inset 0 0 0 1px #e2e8f0' : undefined }}
                title={t(c.name)}
              />
            ))}
          </div>
        </ToolGroup>

        <Divider />

        {/* Board Theme */}
        <div className="relative">
          <button onClick={() => { setShowThemePanel(!showThemePanel); setShowTracingPanel(false); setShowTeachingTools(false); }}
            className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all',
              showThemePanel ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' : 'border-border text-muted-foreground hover:bg-accent')}>
            <span>{currentTheme.icon}</span>
            <span className="hidden lg:inline">{t(currentTheme.name)}</span>
          </button>
          {showThemePanel && (
            <Dropdown wide>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">{t('board.tool.theme')}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {BOARD_THEMES.map(t_theme => (
                  <button key={t_theme.id} onClick={() => changeTheme(t_theme.id)}
                    className={cn('flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all',
                      boardTheme === t_theme.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' : 'border-border hover:border-emerald-300')}>
                    <span className="text-lg">{t_theme.icon}</span>
                    <span className="text-xs font-medium text-foreground">{t(t_theme.name)}</span>
                  </button>
                ))}
              </div>
            </Dropdown>
          )}
        </div>

        {/* Tracing Guides */}
        <div className="relative">
          <button onClick={() => { setShowTracingPanel(!showTracingPanel); setShowThemePanel(false); setShowTeachingTools(false); }}
            className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all',
              showTracingPanel ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' : 'border-border text-muted-foreground hover:bg-accent')}>
            <BookOpen size={14} />
            <span className="hidden lg:inline">{t('board.tool.tracing')}</span>
          </button>
          {showTracingPanel && (
            <Dropdown wide tall>
              {Object.entries(TRACING_GUIDES).map(([key, guide]) => (
                <div key={key} className="mb-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{t(guide.label)}</p>
                  <div className="flex flex-wrap gap-1">
                    {guide.items.map(item => (
                      <button key={item} onClick={() => showTracingGuide(item)}
                        className={cn('w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all hover:scale-105',
                          guideChar === item ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' : 'border-border text-foreground hover:border-emerald-300')}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </Dropdown>
          )}
        </div>

        {/* Teaching Tools */}
        <div className="relative">
          <button onClick={() => { setShowTeachingTools(!showTeachingTools); setShowThemePanel(false); setShowTracingPanel(false); }}
            className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all',
              showTeachingTools ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' : 'border-border text-muted-foreground hover:bg-accent')}>
            <Layers size={14} />
            <span className="hidden lg:inline">{t('board.tool.tools')}</span>
          </button>
          {showTeachingTools && (
            <Dropdown>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">{t('board.teaching_tools')}</p>
              <div className="space-y-2">
                {/* Timer */}
                <div className="p-3 rounded-lg border border-border bg-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer size={14} className="text-blue-500" />
                    <span className="text-xs font-semibold text-foreground">{t('board.timer')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-2xl font-mono font-bold', timerSeconds <= 10 ? 'text-red-500 animate-pulse' : 'text-foreground')}>
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </span>
                    <div className="flex gap-1 ml-auto">
                      <button onClick={() => { setTimerSeconds(60); setTimerRunning(false); }} className="px-2 py-1 rounded text-[10px] border border-border hover:bg-accent">1m</button>
                      <button onClick={() => { setTimerSeconds(180); setTimerRunning(false); }} className="px-2 py-1 rounded text-[10px] border border-border hover:bg-accent">3m</button>
                      <button onClick={() => { setTimerSeconds(300); setTimerRunning(false); }} className="px-2 py-1 rounded text-[10px] border border-border hover:bg-accent">5m</button>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => setTimerRunning(!timerRunning)} className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold text-white', timerRunning ? 'bg-red-500' : 'bg-emerald-500')}>
                      {timerRunning ? t('board.tools.pause') : t('board.tools.start')}
                    </button>
                    <button onClick={() => { setTimerSeconds(60); setTimerRunning(false); }} className="px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-accent">
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>

                {/* Dice */}
                <div className="p-3 rounded-lg border border-border bg-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Dices size={14} className="text-purple-500" />
                    <span className="text-xs font-semibold text-foreground">{t('board.dice')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][diceValue - 1]}</span>
                    <button onClick={rollDice} className="flex-1 py-2 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors">
                      {t('board.tools.roll')}
                    </button>
                  </div>
                </div>

                {/* Random Student Picker */}
                <div className="p-3 rounded-lg border border-border bg-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={14} className="text-pink-500" />
                    <span className="text-xs font-semibold text-foreground">{t('board.random_student')}</span>
                  </div>
                  {showPicker && (
                    <div className="text-center py-2 mb-2">
                      <span className="text-lg font-bold text-foreground animate-pulse">{students[diceValue % students.length]}</span>
                    </div>
                  )}
                  <button onClick={pickStudent} className="w-full py-2 rounded-lg bg-pink-500 text-white text-xs font-semibold hover:bg-pink-600 transition-colors">
                    🎲 {t('board.tools.pick')}
                  </button>
                </div>
              </div>
            </Dropdown>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <ToolGroup label={t('board.labels.actions')}>
          <button onClick={undo} disabled={undoStack.length < 2} className="p-2 rounded-lg text-muted-foreground hover:bg-accent disabled:opacity-30" title={t('undo')}><Undo2 size={15} /></button>
          <button onClick={redo} disabled={redoStack.length === 0} className="p-2 rounded-lg text-muted-foreground hover:bg-accent disabled:opacity-30" title={t('redo')}><Redo2 size={15} /></button>
          <button onClick={clearBoard} className="p-2 rounded-lg text-muted-foreground hover:bg-red-100 dark:hover:bg-red-950/30 hover:text-red-600" title={t('clear')}><Trash2 size={15} /></button>
          <button onClick={downloadBoard} className="p-2 rounded-lg text-muted-foreground hover:bg-accent" title={t('download')}><Download size={15} /></button>
        </ToolGroup>
      </div>

      {/* ======== CANVAS ======== */}
      <div className={cn(
        'relative rounded-xl overflow-hidden shadow-2xl flex-1 min-h-0',
        boardTheme === 'green' && 'border-4 border-amber-900/60',
        boardTheme === 'black' && 'border-4 border-slate-700',
        boardTheme === 'white' && 'border-2 border-slate-200 dark:border-slate-700',
        (boardTheme === 'grid' || boardTheme === 'lined' || boardTheme === 'dotted') && 'border-2 border-slate-300 dark:border-slate-600',
      )}
        style={{ minHeight: isFullscreen ? 'calc(100vh - 160px)' : '500px' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          style={{ cursor: getCursor() }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Chalk tray for green/black boards */}
        {(boardTheme === 'green' || boardTheme === 'black') && (
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-b from-amber-800/80 to-amber-900 flex items-center justify-center gap-3">
            <div className="w-14 h-1.5 rounded bg-white/80" />
            <div className="w-10 h-1.5 rounded bg-yellow-200/80" />
            <div className="w-8 h-1.5 rounded bg-pink-300/80" />
            <div className="w-8 h-1.5 rounded bg-sky-300/80" />
          </div>
        )}

        {/* Active tracing guide badge */}
        {guideChar && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm">
            <span className="text-lg font-bold text-white">{guideChar}</span>
            <button onClick={() => setGuideChar(null)} className="text-white/70 hover:text-white"><X size={14} /></button>
          </div>
        )}

        {/* Timer overlay */}
        {timerRunning && (
          <div className="absolute top-3 left-3 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm">
            <span className={cn('text-2xl font-mono font-bold', timerSeconds <= 10 ? 'text-red-400 animate-pulse' : 'text-white')}>
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* ======== BOTTOM STATUS BAR ======== */}
      <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{t('board.tool.theme')}: {t(currentTheme.name)}</span>
          <span>·</span>
          <span>{t('board.tool.tools')}: {tool}</span>
          <span>·</span>
          <span>{t('board.tool.size')}: {brushSize}px</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{t('board.pages.page_of', { current: currentPageIdx + 1, total: pages.length })}</span>
          <span>·</span>
          <span>{t('undo')}: {undoStack.length - 1} steps</span>
        </div>
      </div>
    </div>
  );
}

// ---- HELPER COMPONENTS ----

function ToolGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {children}
    </div>
  );
}

function ToolButton({ icon: Icon, active, onClick, tip }: { icon: React.ElementType; active: boolean; onClick: () => void; tip: string }) {
  return (
    <button onClick={onClick} title={tip}
      className={cn('p-2 rounded-lg transition-all', active ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
      <Icon size={16} />
    </button>
  );
}

function Divider() {
  return <div className="w-px h-7 bg-border mx-1" />;
}

function Dropdown({ children, wide, tall }: { children: React.ReactNode; wide?: boolean; tall?: boolean }) {
  return (
    <div className={cn(
      'absolute top-full mt-2 left-1/2 -translate-x-1/2 z-30 p-3 rounded-xl border border-border bg-card shadow-2xl animate-fade-in',
      wide ? 'w-64' : 'w-48',
      tall && 'max-h-72 overflow-auto'
    )}>
      {children}
    </div>
  );
}
