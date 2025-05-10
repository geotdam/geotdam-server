class UserDto {
  constructor({ userId, name, nickname, birth, gender, address, email }) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.nickname = nickname;
    this.birth = birth;
    this.gender = gender;
    this.address = address;
  }
}

export default UserDto;
