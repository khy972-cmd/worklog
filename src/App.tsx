import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SiteInfo from './pages/SiteInfo';
import Docs from './pages/Docs';
import Menu from './pages/Menu';
import WorklogList from './pages/WorklogList';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="worklogs" element={<WorklogList />} />
        <Route path="sites" element={<SiteInfo />} />
        <Route path="docs" element={<Docs />} />
        <Route path="menu" element={<Menu />} />
      </Route>
    </Routes>
  );
}
