import axios from "axios";

export class MpesaService {
  /**
   * ================= ENV KEYS =================
   */
  private consumerKey = "LVaAI3GK1YOsAkhE9rCIIBwXH5AUeTEA35rGk2hWz36aOE4k";
  private consumerSecret = "VTAhF2r3l1jBlQNvr26WHGSTGe95ei1PXlqME8vNklRrordbWRyankJkqjwcGtJy";

  /**
   * ================= SANDBOX CREDENTIALS =================
   */
  private shortCode = "174379";

  // ✅ FIXED SANDBOX PASSKEY (IMPORTANT)
private passKey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";  /**
   * ================= BASE URL =================
   */
  private baseUrl = "https://sandbox.safaricom.co.ke";

  /**
   * ================= GET ACCESS TOKEN =================
   */
  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`
    ).toString("base64");

    try {
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      console.log("ACCESS TOKEN SUCCESS");
      return response.data.access_token;
    } catch (error: any) {
      console.log("TOKEN ERROR:");
      console.log(error.response?.data);
      throw error;
    }
  }

  /**
   * ================= TIMESTAMP =================
   */
  private getTimestamp(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const sec = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hour}${min}${sec}`;
  }

  /**
   * ================= STK PUSH =================
   */
  async stkPush(phone: string, amount: number) {
    const token = await this.getAccessToken();

    const timestamp = this.getTimestamp();

    /**
     * ================= PASSWORD =================
     * Base64(ShortCode + PassKey + Timestamp)
     */
    const password = Buffer.from(
      `${this.shortCode}${this.passKey}${timestamp}`
    ).toString("base64");

    console.log("TIMESTAMP:", timestamp);
    console.log("PASSWORD:", password);

    const payload = {
      BusinessShortCode: this.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: phone,
      PartyB: this.shortCode,
      PhoneNumber: phone,
      CallBackURL:
        "https://everyday-rockstar-overflow.ngrok-free.dev/api/mpesa/callback",
      AccountReference: "RMARKET",
      TransactionDesc: "Order Payment",
    };

    console.log("STK PAYLOAD:", payload);

    try {
      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("STK PUSH SUCCESS");
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      console.log("FULL MPESA ERROR:");
      console.log(error.response?.data || error.message);
      throw error;
    }
  }
}