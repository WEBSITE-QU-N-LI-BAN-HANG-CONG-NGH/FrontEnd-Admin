import React from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/features/dashboard/Dashboard';
import './styles/global.css';

function App() {
    return (
        <Layout>
            <Dashboard/>
        </Layout>
    )
}

export default App
