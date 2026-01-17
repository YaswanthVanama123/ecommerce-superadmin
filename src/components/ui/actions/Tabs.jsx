import { useState } from 'react';

/**
 * Tabs Component
 * Accessible tabs with keyboard navigation
 *
 * @param {Object} props
 * @param {Array} props.tabs - Tab definitions [{id, label, content, icon, disabled}]
 * @param {string} props.defaultTab - Default active tab ID
 * @param {Function} props.onChange - Tab change callback
 * @param {string} props.variant - Variant: 'line', 'pill', 'enclosed'
 */
const Tabs = ({
  tabs = [],
  defaultTab,
  onChange,
  variant = 'line',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab?.disabled) {
      setActiveTab(tabId);
      if (onChange) onChange(tabId);
    }
  };

  const handleKeyDown = (e, tabId) => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);

    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex];
      if (!nextTab.disabled) {
        handleTabChange(nextTab.id);
      }
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      const prevTab = tabs[prevIndex];
      if (!prevTab.disabled) {
        handleTabChange(prevTab.id);
      }
    }
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  const variantClasses = {
    line: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-2 border-b-2 -mb-px',
      active: 'border-blue-600 text-blue-600',
      inactive: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300',
    },
    pill: {
      container: 'bg-gray-100 p-1 rounded-lg inline-flex',
      tab: 'px-4 py-2 rounded-md',
      active: 'bg-white text-gray-900 shadow-sm',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
    enclosed: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-2 border border-gray-200 rounded-t-lg -mb-px',
      active: 'bg-white border-b-white text-blue-600',
      inactive: 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={className}>
      {/* Tab list */}
      <div className={styles.container} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            disabled={tab.disabled}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.active : styles.inactive
            } ${
              tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } transition-colors font-medium text-sm flex items-center gap-2`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
