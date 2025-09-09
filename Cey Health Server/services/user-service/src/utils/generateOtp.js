import bcrypt from "bcryptjs";
class OTP {
  //generate otp
  async #generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // generateHash OTP method
  async #generateHashOTP(otp) {
    const saltRounds = 10;
    return await bcrypt.hash(otp, saltRounds);
  }

  //get otp
  async getOtp() {
    return await this.#generateOtp();
  }

  //hash otp
  async hashOTP(otp) {
    return await this.#generateHashOTP(otp);
  }
}

export default OTP;
