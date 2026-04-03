const { DB_URL } = require('../config/firebaseConfig');

async function fbGet(path) {
  const res = await fetch(`${DB_URL}/${path}.json`);
  return res.json();
}

async function fbSet(path, data) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function fbUpdate(path, data) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function fbPush(path, data) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function fbDelete(path) {
  const res = await fetch(`${DB_URL}/${path}.json`, { method: 'DELETE' });
  return res.json();
}

module.exports = {
  fbGet,
  fbSet,
  fbUpdate,
  fbPush,
  fbDelete,
};
