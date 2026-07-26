import React, { useState } from 'react';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }, 3000);
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 700 }}>
        <h1 className="section-title">Get in Touch</h1>
        <p className="section-subtitle">Have questions or feedback? We'd love to hear from you.</p>

        <div className="card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: 'var(--color-accent)' }}>Thank you!</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Your message has been received. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Your message..." rows={6} required style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Email</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>contact@indialens.in</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🐦</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Twitter</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>@IndiaLensDash</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>GitHub</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>github.com/indialens</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
