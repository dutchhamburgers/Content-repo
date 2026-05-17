import { useEffect, useMemo, useState } from 'react';

const EMPTY_STATUS = { kind: 'idle', message: '' };

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function withClientKeys(items) {
  return items.map((item) => ({
    ...item,
    clientKey: crypto.randomUUID(),
  }));
}

function suggestId(items, category = 'faq-item') {
  const base = slugify(category) || 'faq-item';
  let index = 1;
  let suggestion = `${base}-${index}`;
  const existing = new Set(items.map((item) => item.id));

  while (existing.has(suggestion)) {
    index += 1;
    suggestion = `${base}-${index}`;
  }

  return suggestion;
}

function validateItem(item, allItems, allowedVisibleOn) {
  const errors = [];

  for (const field of ['id', 'category', 'question', 'answer']) {
    if (!item[field] || item[field].trim() === '') {
      errors.push(`${field} is verplicht.`);
    }
  }

  const duplicateId = allItems.some(
    (candidate) => candidate.clientKey !== item.clientKey && candidate.id === item.id,
  );
  if (duplicateId) {
    errors.push('ID moet uniek zijn.');
  }

  if (!Number.isInteger(Number(item.order))) {
    errors.push('Order moet een geheel getal zijn.');
  }

  if (!Array.isArray(item.visibleOn) || item.visibleOn.length === 0) {
    errors.push('Selecteer minimaal één visibleOn waarde.');
  }

  if (
    Array.isArray(item.visibleOn) &&
    item.visibleOn.some((target) => !allowedVisibleOn.includes(target))
  ) {
    errors.push(`visibleOn mag alleen ${allowedVisibleOn.join(', ')} bevatten.`);
  }

  return errors;
}

function sortItems(items) {
  return [...items].sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
}

export default function App() {
  const [faq, setFaq] = useState(null);
  const [allowedVisibleOn, setAllowedVisibleOn] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [loadError, setLoadError] = useState('');
  const [saveStatus, setSaveStatus] = useState(EMPTY_STATUS);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/faq');
        const data = await response.json();

        if (!response.ok) {
          throw new Error((data.errors || ['Kon FAQ niet laden.']).join(' '));
        }

        const items = withClientKeys(data.faq.items);
        setFaq({ ...data.faq, items });
        setAllowedVisibleOn(data.allowedVisibleOn);
        setSelectedKey(items[0]?.clientKey ?? null);
        setLoadError('');
      } catch (error) {
        setLoadError(error.message);
      }
    }

    load();
  }, []);

  const categories = useMemo(() => {
    if (!faq) {
      return [];
    }

    return [...new Set(faq.items.map((item) => item.category))].sort((left, right) =>
      left.localeCompare(right),
    );
  }, [faq]);

  const filteredItems = useMemo(() => {
    if (!faq) {
      return [];
    }

    const items =
      filterCategory === 'all'
        ? faq.items
        : faq.items.filter((item) => item.category === filterCategory);

    return sortItems(items);
  }, [faq, filterCategory]);

  const selectedItem = faq?.items.find((item) => item.clientKey === selectedKey) ?? null;
  const selectedErrors = selectedItem ? validateItem(selectedItem, faq.items, allowedVisibleOn) : [];

  function updateSelectedItem(patch) {
    if (!selectedItem || !faq) {
      return;
    }

    const nextItems = faq.items.map((item) =>
      item.clientKey === selectedItem.clientKey ? { ...item, ...patch } : item,
    );
    setFaq({ ...faq, items: nextItems });
    setSaveStatus(EMPTY_STATUS);
  }

  function handleAddItem() {
    if (!faq) {
      return;
    }

    const category = filterCategory === 'all' ? categories[0] || 'Nieuwe categorie' : filterCategory;
    const nextItem = {
      clientKey: crypto.randomUUID(),
      id: suggestId(faq.items, category),
      category,
      question: '',
      answer: '',
      visibleOn: [allowedVisibleOn[0] || 'sales'],
      order: Math.max(0, ...faq.items.map((item) => item.order)) + 1,
      isActive: true,
    };

    setFaq({ ...faq, items: [...faq.items, nextItem] });
    setSelectedKey(nextItem.clientKey);
    setSaveStatus(EMPTY_STATUS);
  }

  function handleDeleteItem() {
    if (!faq || !selectedItem) {
      return;
    }

    const nextItems = faq.items.filter((item) => item.clientKey !== selectedItem.clientKey);
    setFaq({ ...faq, items: nextItems });
    setSelectedKey(nextItems[0]?.clientKey ?? null);
    setSaveStatus({ kind: 'warning', message: 'Item verwijderd uit de conceptweergave. Klik op opslaan om dit naar faq.json te schrijven.' });
  }

  async function handleSave() {
    if (!faq) {
      return;
    }

    const allErrors = faq.items.flatMap((item) => validateItem(item, faq.items, allowedVisibleOn));
    if (allErrors.length > 0) {
      setSaveStatus({ kind: 'error', message: [...new Set(allErrors)].join(' ') });
      return;
    }

    const payload = {
      version: faq.version,
      updatedAt: faq.updatedAt,
      items: faq.items.map(({ clientKey, order, ...item }) => ({
        ...item,
        order: Number(order),
      })),
    };

    const response = await fetch('/api/faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      setSaveStatus({ kind: 'error', message: (data.errors || ['Opslaan mislukt.']).join(' ') });
      return;
    }

    const items = withClientKeys(data.faq.items);
    const nextSelected =
      items.find((item) => item.id === selectedItem?.id)?.clientKey ?? items[0]?.clientKey ?? null;

    setFaq({ ...data.faq, items });
    setAllowedVisibleOn(data.allowedVisibleOn);
    setSelectedKey(nextSelected);
    setSaveStatus({ kind: 'success', message: `Opgeslagen naar faq/faq.json om ${new Date(data.faq.updatedAt).toLocaleTimeString('nl-NL')}.` });
  }

  if (loadError) {
    return <main className="page"><p className="status error">{loadError}</p></main>;
  }

  if (!faq) {
    return <main className="page"><p>FAQ laden...</p></main>;
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Lokale FAQ editor</h1>
          <p>Beheer direct de inhoud van <code>faq/faq.json</code> zonder handmatig JSON te bewerken.</p>
        </div>
        <div className="actions">
          <button type="button" onClick={handleAddItem}>Nieuw item</button>
          <button type="button" className="primary" onClick={handleSave}>Opslaan</button>
        </div>
      </header>

      <section className="toolbar">
        <label>
          Filter op categorie
          <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
            <option value="all">Alle categorieën</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <p className={`status ${saveStatus.kind}`}>{saveStatus.message || `Totaal ${faq.items.length} FAQ-items.`}</p>
      </section>

      <section className="layout">
        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Categorie</th>
                <th>Vraag</th>
                <th>Zichtbaar op</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.clientKey}
                  className={item.clientKey === selectedKey ? 'selected' : ''}
                  onClick={() => setSelectedKey(item.clientKey)}
                >
                  <td>{item.id}</td>
                  <td>{item.category}</td>
                  <td>{item.question}</td>
                  <td>{item.visibleOn.join(', ')}</td>
                  <td>{item.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel editor">
          {selectedItem ? (
            <>
              <div className="editor-header">
                <h2>FAQ-item bewerken</h2>
                <button type="button" className="danger" onClick={handleDeleteItem}>Verwijder item</button>
              </div>

              <div className="form-grid">
                <label>
                  ID
                  <input
                    value={selectedItem.id}
                    onChange={(event) => updateSelectedItem({ id: event.target.value })}
                  />
                </label>

                <label>
                  Categorie
                  <input
                    value={selectedItem.category}
                    onChange={(event) => updateSelectedItem({ category: event.target.value })}
                  />
                </label>

                <label className="full-width field-question">
                  Vraag
                  <input
                    value={selectedItem.question}
                    onChange={(event) => updateSelectedItem({ question: event.target.value })}
                  />
                </label>

                <label className="field-answer">
                  Antwoord
                  <textarea
                    rows="8"
                    value={selectedItem.answer}
                    onChange={(event) => updateSelectedItem({ answer: event.target.value })}
                  />
                </label>

                <div className="editor-controls">
                  <label className="field-order">
                    Order
                    <input
                      type="number"
                      value={selectedItem.order}
                      onChange={(event) => updateSelectedItem({ order: event.target.value })}
                    />
                  </label>

                  <fieldset className="field-visible-on">
                    <legend>visibleOn</legend>
                    <div className="checkbox-row">
                      {allowedVisibleOn.map((target) => (
                        <label key={target} className="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedItem.visibleOn.includes(target)}
                            onChange={(event) =>
                              updateSelectedItem({
                                visibleOn: event.target.checked
                                  ? [...selectedItem.visibleOn, target]
                                  : selectedItem.visibleOn.filter((value) => value !== target),
                              })
                            }
                          />
                          {target}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="checkbox field-active">
                    <input
                      type="checkbox"
                      checked={selectedItem.isActive}
                      onChange={(event) => updateSelectedItem({ isActive: event.target.checked })}
                    />
                    Item is actief
                  </label>
                </div>
              </div>

              {selectedErrors.length > 0 && (
                <div className="status error">
                  <strong>Validatiefouten:</strong>
                  <ul>
                    {selectedErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="preview">
                <h3>Preview</h3>
                <p><strong>Vraag:</strong> {selectedItem.question || '—'}</p>
                <p><strong>Categorie:</strong> {selectedItem.category || '—'}</p>
                <p><strong>Zichtbaar op:</strong> {selectedItem.visibleOn.join(', ') || '—'}</p>
                <p><strong>Status:</strong> {selectedItem.isActive ? 'Actief' : 'Inactief'}</p>
                <article>{selectedItem.answer || 'Nog geen antwoord ingevuld.'}</article>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>Geen FAQ geselecteerd</h2>
              <p>Selecteer een item uit de lijst of voeg een nieuw item toe.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
