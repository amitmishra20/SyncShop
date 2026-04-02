import { useState } from 'react';
import {
  Bell,
  Boxes,
  ClipboardList,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const INITIAL_SETTINGS = [
  {
    id: 'alerts',
    title: 'Auto-restock alerts',
    description: 'Notify the admin when fast-moving products fall below safe stock levels.',
    enabled: true,
    icon: <Bell size={18} />,
  },
  {
    id: 'delivery',
    title: 'Delivery delay warnings',
    description: 'Flag orders that are taking longer than the expected service window.',
    enabled: true,
    icon: <ClipboardList size={18} />,
  },
  {
    id: 'digest',
    title: 'Daily business digest',
    description: 'Send a summary of revenue, orders, and stock pressure every evening.',
    enabled: false,
    icon: <Mail size={18} />,
  },
  {
    id: 'recommendations',
    title: 'Smart stock recommendations',
    description: 'Show product and category suggestions based on movement and stock trends.',
    enabled: true,
    icon: <Sparkles size={18} />,
  },
];

export default function Settings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const toggleSetting = (settingId) => {
    setSettings((currentSettings) =>
      currentSettings.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  return (
    <div className="admin-dashboard-dark">
      <div className="admin-dashboard-head">
        <div>
          <h2>Settings</h2>
          <p>Control alerts, business automation, and admin-level operational preferences.</p>
        </div>
      </div>

      <div className="insight-grid-dark">
        <div className="insight-card-dark">
          <div className="insight-icon">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4>Admin controls</h4>
            <p>Manage which operational safeguards remain active.</p>
          </div>
        </div>

        <div className="insight-card-dark">
          <div className="insight-icon">
            <Boxes size={18} />
          </div>
          <div>
            <h4>Stock visibility</h4>
            <p>Keep inventory and low-stock workflows responsive.</p>
          </div>
        </div>

        <div className="insight-card-dark">
          <div className="insight-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <h4>Smart suggestions</h4>
            <p>Enable decision support features for the store owner.</p>
          </div>
        </div>
      </div>

      <div className="admin-chart-grid">
        <article className="admin-card-dark">
          <h3>Operational toggles</h3>

          <div className="settings-list-dark">
            {settings.map((setting) => (
              <div key={setting.id} className="settings-item-dark">
                <div className="settings-item-dark__icon">
                  {setting.icon}
                </div>

                <div className="settings-item-dark__content">
                  <strong>{setting.title}</strong>
                  <span>{setting.description}</span>
                </div>

                <button
                  type="button"
                  className={`toggle-button-dark${setting.enabled ? ' is-active' : ''}`}
                  aria-label={`Toggle ${setting.title}`}
                  aria-pressed={setting.enabled}
                  onClick={() => toggleSetting(setting.id)}
                >
                  <span className="toggle-button-dark__thumb" />
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card-dark">
          <h3>Support checklist</h3>

          <div className="admin-table-dark">
            <div className="admin-table-row-dark">
              <div>
                <strong>Primary operations contact</strong>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>
                  Keep one admin owner responsible for stock and order exceptions.
                </p>
              </div>
            </div>

            <div className="admin-table-row-dark">
              <div>
                <strong>Inventory recovery rule</strong>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>
                  Replenish products immediately when stock falls below reorder level.
                </p>
              </div>
            </div>

            <div className="admin-table-row-dark">
              <div>
                <strong>Customer issue handling</strong>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>
                  Review delayed or failed orders before the next order cycle starts.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}