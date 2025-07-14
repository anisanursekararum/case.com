import { BrowserRouter, Routes, Router, Route } from "react-router-dom";
import TestSuiteListPage from "./features/test-suites/pages/TestSuiteListPage.jsx";
import TestSuiteCreatePage from "./features/test-suites/pages/TestSuiteCreatePage.jsx";
import TestSuiteEditPage from "./features/test-suites/pages/TestSuiteEditPage.jsx";
import Layout from "./layouts/Layout.jsx";
import TestSuiteList from "./features/test-suites/components/TestSuiteList.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<TestSuiteListPage />} />
            <Route path="/add" element={<TestSuiteCreatePage />} />
            <Route path="/edit/:id" element={<TestSuiteEditPage />} />
            <Route path="/edit/:id" element={<TestSuiteEditPage />} />
            <Route path="/test-suite-collapsed" element={<TestSuiteList />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
