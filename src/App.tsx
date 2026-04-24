import './App.scss';
import { FoundationsPreview } from './components/foundations-preview/FoundationsPreview';
import { Header } from './components/header/Header';

export function App() {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <Header />
      </header>
      <main className="app-shell__content">
        <FoundationsPreview />
      </main>
    </div>
  );
}
