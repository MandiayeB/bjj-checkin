import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      {needRefresh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-6 ring-1 ring-zinc-800 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-zinc-100 mb-2">
                  Nouvelle version disponible
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Une nouvelle version de GFA Présences est disponible. Cliquez sur "Mettre à jour" pour obtenir les dernières fonctionnalités.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateServiceWorker(true)}
                    className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-touch transition-colors"
                  >
                    Mettre à jour
                  </button>
                  <button
                    onClick={close}
                    className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-100 text-touch ring-1 ring-zinc-700 transition-colors"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}