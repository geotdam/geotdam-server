// src/test.js 또는 src/test/relationshipTest.js
import db from './models/index.js';

async function testRelationship() {
  const user = await db.Users.findByPk(1, {
    include: [{ model: db.UserImg }]
  });

  console.log(user.UserImg);  // 연관된 이미지 확인

  console.log('✅ 유저 데이터:', user?.toJSON?.());

  if (user?.userImgs) {
    console.log('🖼️ 연결된 이미지:', user.userImg);
  } else {
    console.log('⚠️ 관계된 이미지가 없습니다.');
  }

  console.log('👀 유저 키 목록:', Object.keys(user.toJSON()));
}

testRelationship();