import React, { useState, useEffect } from 'react';
import '../styles/homepage.css';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ArticleList from '../components/ArticleList';
import Sidebar from '../components/Sidebar';

const API = '/api';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [articleFilter, setArticleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      try {
        const [aRes, mRes, eRes] = await Promise.all([
          fetch(`${API}/articles`),
          fetch(`${API}/members`),
          fetch(`${API}/events`),
        ]);
        const [articlesData, membersData, eventsData] = await Promise.all([
          aRes.json(),
          mRes.json(),
          eRes.json(),
        ]);
        if (!mounted) return;
        setArticles(Array.isArray(articlesData) ? articlesData : []);
        setMembers(Array.isArray(membersData) ? membersData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();

    const refreshTimer = setInterval(fetchAll, 30000);
    function handleWindowFocus() {
      fetchAll();
    }
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      mounted = false;
      clearInterval(refreshTimer);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return (
    <div id="container">
      <Navbar />
      <Hero />
      <div className="mainbody">
        {loading ? (
          <p style={{ color: '#555', fontSize: '14px', margin: '40px auto' }}>Loading...</p>
        ) : (
          <>
            <ArticleList articles={articles} filter={articleFilter} onFilterChange={setArticleFilter} />
            <Sidebar members={members} events={events} />
          </>
        )}
      </div>
    </div>
  );
}
