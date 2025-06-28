db = db.getSiblingDB('lclr_db');
db.createUser({
  user: 'lclr_user',
  pwd: '1th4ok1ymfurQaM9',
  roles: [
    {
      role: 'readWrite',
      db: 'lclr_db',
    },
  ],
});
