import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(false), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setToast(true)
      setForm({ name: '', email: '', message: '' })
    }
  }

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  const position = [12.971793, 77.641196]

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div className="section-header">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you! Reach out and we'll get back to you.</p>
        </div>

        <div className="contact-grid">
          {/* Form */}
          <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange('name')}
                />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Your Email</label>
                <input
                  id="contact-email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange('email')}
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Your Message</label>
                <textarea
                  id="contact-message"
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  placeholder="Write your message"
                  value={form.message}
                  onChange={handleChange('message')}
                />
                {errors.message && (
                  <div className="error-text">{errors.message}</div>
                )}
              </div>

              <button type="submit" className="btn-primary btn-lg" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>

          {/* Info + Map */}
          <div>
            <div className="contact-info-card glass-card">
              <h3>Get in Touch</h3>
              <div className="contact-item">
                <div className="contact-item-icon">Email</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Email</div>
                  <div>adarsh.ks@bca.christuniversity.in</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">Phone</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Phone</div>
                  <div>080-123-456</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">Location</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Address</div>
                  <div>#01, 100ft Road, Indiranagar, Bangalore</div>
                </div>
              </div>
            </div>

            <div className="map-container" style={{ marginTop: 'var(--space-lg)' }}>
              <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    <b>HockeyHub HQ</b><br />
                    #01, 100ft Road, Indiranagar, Bangalore
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast">Message sent successfully!</div>}
    </div>
  )
}
