// script.js
// Fetch newsletter data and build the page dynamically

document.addEventListener('DOMContentLoaded', () => {
  fetch('newsletter_data.json')
    .then((res) => res.json())
    .then((data) => {
      buildNewsletter(data);
    })
    .catch((err) => {
      console.error('Failed to load newsletter data', err);
    });

  // Modal functionality
  const modal = document.getElementById('modal');
  const modalCloseBtn = document.getElementById('modal-close');
  modalCloseBtn.addEventListener('click', () => hideModal());
  modal.addEventListener('click', (e) => {
    // Close modal when clicking outside content
    if (e.target === modal) {
      hideModal();
    }
  });

  // Handle subscription form submission
  const subscribeForm = document.getElementById('subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = subscribeForm.elements['name'].value;
      const email = subscribeForm.elements['email'].value;
      // Send a mailto link to the designated email with form details
      const mailtoLink = `mailto:info@mabaistrategies.com?subject=${encodeURIComponent('Mindsphere Newsletter Signup')}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email)}`;
      window.location.href = mailtoLink;
    });
  }

  // Handle client inquiry form submission
  const clientForm = document.getElementById('client-form');
  if (clientForm) {
    clientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = clientForm.elements['name'].value;
      const company = clientForm.elements['company'].value;
      const email = clientForm.elements['email'].value;
      const details = clientForm.elements['details'].value;
      const body = `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nDetails: ${details}`;
      const mailtoLink = `mailto:info@mabaistrategies.com?subject=${encodeURIComponent('Mindsphere Client Inquiry')}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    });
  }
});

function buildNewsletter(data) {
  const container = document.getElementById('content');

  // Hero Section
  const heroSection = document.createElement('section');
  heroSection.classList.add('section', 'hero');
  const heroHeading = document.createElement('h2');
  heroHeading.textContent = data.meta.hero_headline;
  heroSection.appendChild(heroHeading);
  data.meta.hero_body.forEach((para) => {
    const p = document.createElement('p');
    p.textContent = para;
    heroSection.appendChild(p);
  });
  container.appendChild(heroSection);

  // Scoreboard Section
  if (data.scoreboard) {
    const scoreboardSection = document.createElement('section');
    scoreboardSection.classList.add('section');
    const sbHeading = document.createElement('h2');
    sbHeading.textContent = 'Signals → Systems Scoreboard';
    scoreboardSection.appendChild(sbHeading);
    const table = document.createElement('table');
    table.classList.add('scoreboard-table');
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['Theme', 'Watchlist', 'Pilot', 'Production'].forEach((thText) => {
      const th = document.createElement('th');
      th.textContent = thText;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    data.scoreboard.themes.forEach((theme) => {
      const row = document.createElement('tr');
      const tdName = document.createElement('td');
      tdName.textContent = theme.name;
      row.appendChild(tdName);
      ['watchlist', 'pilot', 'production'].forEach((key) => {
        const td = document.createElement('td');
        td.textContent = theme[key];
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    scoreboardSection.appendChild(table);
    if (data.scoreboard.commentary) {
      const commentaryP = document.createElement('p');
      commentaryP.textContent = data.scoreboard.commentary;
      scoreboardSection.appendChild(commentaryP);
    }
    container.appendChild(scoreboardSection);
  }

  // Signals Section
  ['primary', 'secondary', 'tertiary'].forEach((tier) => {
    const list = data.signals[tier];
    if (list && list.length > 0) {
      const section = document.createElement('section');
      section.classList.add('section');
      const title = document.createElement('h2');
      title.textContent = `${capitalize(tier)} Signals`;
      section.appendChild(title);
      const containerList = document.createElement('div');
      containerList.classList.add('signal-list');
      list.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('signal-card');
        card.dataset.tier = tier;
        // Save full item on element for modal
        card._data = item;

        const h3 = document.createElement('h3');
        h3.classList.add('signal-title');
        h3.textContent = item.title;
        card.appendChild(h3);

        const summary = document.createElement('p');
        summary.classList.add('signal-summary');
        summary.textContent = item.summary;
        card.appendChild(summary);

        // Meta row
        const meta = document.createElement('p');
        meta.classList.add('signal-meta');
        meta.textContent = `Readiness: ${item.automation_readiness.readiness} | TTV: ${item.automation_readiness.time_to_value}`;
        card.appendChild(meta);

        card.addEventListener('click', () => {
          showModal(card._data);
        });

        containerList.appendChild(card);
      });
      section.appendChild(containerList);
      container.appendChild(section);
    }
  });

  // Spotlight section
  if (data.spotlight) {
    const spotSection = document.createElement('section');
    spotSection.classList.add('section');
    const h2 = document.createElement('h2');
    h2.textContent = 'Midsized Operator Spotlight';
    spotSection.appendChild(h2);
    const h3 = document.createElement('h3');
    h3.textContent = data.spotlight.title;
    spotSection.appendChild(h3);
    data.spotlight.story_paragraphs.forEach((para) => {
      const p = document.createElement('p');
      p.textContent = para;
      spotSection.appendChild(p);
    });
    container.appendChild(spotSection);
  }

  // Playbook section
  if (data.playbooks && data.playbooks.length > 0) {
    const pbSection = document.createElement('section');
    pbSection.classList.add('section');
    const h2 = document.createElement('h2');
    h2.textContent = 'Playbook of the Night';
    pbSection.appendChild(h2);
    data.playbooks.forEach((pb) => {
      const pbDiv = document.createElement('div');
      pbDiv.classList.add('playbook');
      const nameEl = document.createElement('h4');
      nameEl.textContent = pb.name;
      pbDiv.appendChild(nameEl);
      const ul = document.createElement('ul');
      const liStack = document.createElement('li');
      liStack.innerHTML = `<strong>Stack:</strong> ${pb.stack.join(', ')}`;
      ul.appendChild(liStack);
      const liTrigger = document.createElement('li');
      liTrigger.innerHTML = `<strong>Trigger:</strong> ${pb.trigger}`;
      ul.appendChild(liTrigger);
      const liAction = document.createElement('li');
      liAction.innerHTML = `<strong>Action:</strong> ${pb.action}`;
      ul.appendChild(liAction);
      const liGuard = document.createElement('li');
      liGuard.innerHTML = `<strong>Guardrails:</strong> ${pb.guardrails}`;
      ul.appendChild(liGuard);
      const liKPI = document.createElement('li');
      liKPI.innerHTML = `<strong>KPI:</strong> ${pb.kpi}`;
      ul.appendChild(liKPI);
      pbDiv.appendChild(ul);
      pbSection.appendChild(pbDiv);
    });
    container.appendChild(pbSection);
  }

  // Reflection section
  if (data.reflection && data.reflection.length > 0) {
    const reflSection = document.createElement('section');
    reflSection.classList.add('section');
    const h2 = document.createElement('h2');
    h2.textContent = 'Today’s Reflection';
    reflSection.appendChild(h2);
    data.reflection.forEach((para) => {
      const p = document.createElement('p');
      p.textContent = para;
      reflSection.appendChild(p);
    });
    container.appendChild(reflSection);
  }

  // Actions section
  if (data.actions) {
    const actSection = document.createElement('section');
    actSection.classList.add('section', 'actions');
    const h2 = document.createElement('h3');
    h2.textContent = 'Action Items';
    actSection.appendChild(h2);
    const ul = document.createElement('ul');
    const liOperator = document.createElement('li');
    liOperator.innerHTML = `<strong>Operator Action:</strong> ${data.actions.operator_action}`;
    ul.appendChild(liOperator);
    const liEngage = document.createElement('li');
    liEngage.innerHTML = `<strong>Engagement Action:</strong> ${data.actions.engagement_action}`;
    ul.appendChild(liEngage);
    actSection.appendChild(ul);
    container.appendChild(actSection);
  }

  // Office hours CTA
  if (data.office_hours) {
    const ohSection = document.createElement('section');
    ohSection.classList.add('section');
    const h2 = document.createElement('h2');
    h2.textContent = data.office_hours.headline;
    ohSection.appendChild(h2);
    data.office_hours.body_paragraphs.forEach((para) => {
      const p = document.createElement('p');
      p.textContent = para;
      ohSection.appendChild(p);
    });
    // Provide mailto link
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = `mailto:${data.office_hours.mailto}?subject=${encodeURIComponent(data.office_hours.subject_line || '')}`;
    a.textContent = data.office_hours.mailto;
    p.appendChild(document.createTextNode('Email '));
    p.appendChild(a);
    p.appendChild(document.createTextNode(' to apply.'));
    ohSection.appendChild(p);
    container.appendChild(ohSection);
  }
}

// Helper: capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showModal(item) {
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');
  document.getElementById('modal-title').textContent = item.title;
  // Meta info: readiness, tags, TTV
  const metaDiv = document.getElementById('modal-meta');
  metaDiv.textContent = `Readiness: ${item.automation_readiness.readiness} | TTV: ${item.automation_readiness.time_to_value} | Tags: ${item.tags.join(', ')}`;
  const bodyDiv = document.getElementById('modal-body');
  bodyDiv.innerHTML = '';
  item.body_paragraphs.forEach((para) => {
    const p = document.createElement('p');
    p.textContent = para;
    bodyDiv.appendChild(p);
  });
  const predDiv = document.getElementById('modal-predictive');
  predDiv.innerHTML = `<strong>Predictive conclusion:</strong> ${item.predictive_conclusion}`;
  const sourcesDiv = document.getElementById('modal-sources');
  sourcesDiv.innerHTML = '';
  if (item.citations && item.citations.length > 0) {
    const span = document.createElement('span');
    span.innerHTML = '<strong>Sources:</strong> ';
    sourcesDiv.appendChild(span);
    item.citations.forEach((cite, idx) => {
      const a = document.createElement('a');
      a.href = cite.url;
      a.textContent = cite.label || `Source ${idx + 1}`;
      a.target = '_blank';
      sourcesDiv.appendChild(a);
      if (idx < item.citations.length - 1) {
        sourcesDiv.appendChild(document.createTextNode(', '));
      }
    });
  }
}

function hideModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
}