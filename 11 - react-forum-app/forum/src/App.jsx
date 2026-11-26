import { AuthProvider } from './context/AuthContext.jsx';
import { NoticeProvider } from './context/NoticeContext.jsx';
import Forum from './components/Forum.jsx';

export default function App() {
  return (
    <NoticeProvider>
      <AuthProvider>
        <Forum />
      </AuthProvider>
    </NoticeProvider>
  );
}
