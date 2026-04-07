import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, XCircle, AlertCircle, Users } from 'lucide-react';
import type { Child } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface AttendanceScannerModalProps {
  open: boolean;
  onClose: () => void;
  childrenList: Child[];
  onConfirm: (attendanceResults: Record<string, boolean>) => void;
}

export function AttendanceScannerModal({ open, onClose, childrenList, onConfirm }: AttendanceScannerModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'idle' | 'scan' | 'review'>('idle');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      setStep('scan');
      
      // Initialize everyone as present by default to mimic AI matching all recognized faces
      const initialMap: Record<string, boolean> = {};
      childrenList.forEach((child, index) => {
        // Randomly simulate an absence for demonstration purposes (e.g., child at index 3)
        initialMap[child.id] = index !== 3; 
      });
      setAttendance(initialMap);

      const timer = setTimeout(() => {
        setStep('review');
      }, 3000); // 3 seconds scan

      return () => clearTimeout(timer);
    } else {
      setStep('idle');
    }
  }, [open, childrenList]);

  useEffect(() => {
    if (!open) {
      setStep('idle');
    }
  }, [open]);

  const handleToggle = (id: string) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleConfirm = () => {
    onConfirm(attendance);
    onClose();
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <div 
          key="scanner-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 isolate"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border shadow-xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">{t('attendance.scanner_title')}</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-md hover:bg-accent text-muted-foreground transition-colors"
                disabled={step === 'scan'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto relative">
              {step === 'scan' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-12 text-center h-[400px]"
                >
                  <div className="relative w-48 h-48 mb-6 border-2 border-dashed border-primary/50 rounded-2xl overflow-hidden flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 bg-primary/10"
                      initial={{ top: '-100%' }}
                      animate={{ top: '100%' }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5, 
                        ease: "linear"
                      }}
                    />
                    <motion.div 
                      className="absolute w-full h-1 bg-primary blur-[2px] shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5, 
                        ease: "linear"
                      }}
                    />
                    <Users className="w-16 h-16 text-primary/40" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground animate-pulse">{t('attendance.scanning')}</h4>
                  <p className="text-sm text-muted-foreground mt-2">{t('attendance.hold_steady')}</p>
                </motion.div>
              )}

              {step === 'review' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4"
                >
                  <div className="flex bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-3 mb-4 gap-3 items-center">
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>{t('attendance.scan_complete')}</strong> {t('attendance.scan_summary', { present: presentCount, total: childrenList.length })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {childrenList.map((child) => {
                      const isPresent = attendance[child.id];
                      return (
                        <div 
                          key={child.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            isPresent 
                              ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10' 
                              : 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground font-bold text-sm">
                              {child.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-sm">{child.name}</p>
                              {child.riskFlags.combinedRisk === 'High' && (
                                <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 w-max mt-0.5">
                                  <AlertCircle className="w-3 h-3" /> {t('common.at_risk')}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleToggle(child.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 min-w-[90px] justify-center ${
                              isPresent 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60'
                            }`}
                          >
                            {isPresent ? (
                              <><Check className="w-3 h-3" /> {t('attendance.present')}</>
                            ) : (
                              <><XCircle className="w-3 h-3" /> {t('attendance.absent')}</>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-card">
              <button
                disabled={step === 'scan'}
                onClick={handleConfirm}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
              >
                {step === 'scan' ? (
                  <span className="animate-pulse">{t('attendance.processing')}</span>
                ) : (
                  <>{t('attendance.submit_count', { present: presentCount, total: childrenList.length })}</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
