import { SatsangSSO } from "../db/repository/accomodation.repo";
export default class DataGenerator{
/* ---------- BASIC HELPERS ---------- */

  private static randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private static randomNumber(length: number): string {
    return Math.floor(
      Math.pow(10, length - 1) +
      Math.random() * 9 * Math.pow(10, length - 1)
    ).toString();
  }

// REGISTRATION DATA GENERATION
// ADDRESS
  static randomAddressLine1():string{
    return ''
  }

  static randomAddressLine2():string{
    return ''
  }

  static randomAddressLine3():string{
    return ''
  }

  static randomAddressType():string{
    return ''
  }

  static randomCityDistrictPincodeStateCountry():{}{
    return {
        city:'',
        district:'',
        pincode:'',
        state:'',
        country:'India'
    }
  }

  static randomRegistationStatus(){
    return ''
  }

// DEVOTEE PROFILE
  static randomDevoteeNameAndFamilyCode():{}{
    return {
        firstName:'',
        lastName:'',
        familyCode:''
    }
  }

  static randomDateOfBirth(){
    return '10-04-1998'
  }

  static randomGenderAndRelationship(){
    return {
        gender:'',
        relationship:''
    }
  }

  static randomEmail(){

  }
  
  static randomMobileNumber(){

  }

  static randomAadhaarIdentityNumber(){

  }

  static randomReligion(){

  }

  static randomMaritalStatus(){

  }

  static randomPhysicalChallenge(){

  }

  static randomIsFullyCovidVaccinated(){

  }

  static randomDevoteeAgreementContent(){

  }

  static randomDikshaPlace(){
    return `By checking the below box, I agree that I have read all the terms and conditions, as present in the Terms & Conditions link https://app.acco.satsangphilanthropy.com/#/termsnconditions  and have also read the general guidelines of accomodation and it's various processes to be followed, as described in the link Guidelines https://app.acco.satsangphilanthropy.com/#/guidelinesnfaqs and I hereby consent that I have understood and would abide by it in full and also hereby declare that I would convey the information present in the aforementioned link to all the visitors visiting the Satsang Ashram, Deoghar through the booking made using this online Accomodation System to abide by the same terms and conditions and guidelines without any deviations. Moreover, I further declare that I would be fully responsible for any inappropriate conduct or deviations from the information shared in the aforementioned link, and would not held Satsang Deoghar or any of it's associates responsible for whatsoever.I,  S/O or D/O or W/O Bishnu Charan Swain from place null agree to the above mentioned terms and conditions and guidelines.`
  }

  // Update Member
  static randomDevoteeId(){

  }

  // Add Visitor
  static randomFullName(){

  }

  static randomGenderAndVisitorRelationship(){
    return{
        gender:'',
        relationship:''
    }
  }



  // Update Visitor
  static randomVisitorId(){

  }

  //DB Calls

  static async getRandomRegisteredSSOMemberContactNumber(){
    const contactNumber = await SatsangSSO.getRandomSSORegisteredMemberContact()
    return contactNumber
  }

  static async getRandomUnRegisteredSSOMemberContactNumber(){
    const contactNumber = await SatsangSSO.getRandomSSOUnRegisteredMemberContact()
    return contactNumber
  }





  

}