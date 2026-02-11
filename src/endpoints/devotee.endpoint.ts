export const DEVOTEE_ENDPOINTS = {
  POST_REGISTER: '/devotee/register',
  POST_ADD_FAMILY_MEMBER: '/devotee/fc/members',
  GET_FAMILY_MEMBER: '/devotee/fc/members',
  GET_VISITORS: '/devotee/fc/visitor?familyCode=001876407000',
  GET_PROFILE: '/devotee/me/profile',
  GET_MEMBER: '/devotee/members',
  POST_VERIFY_FAMILY_MEMBER_NAME: '/devotee/fc/fullName/verify',
  PUT_UPDATE_MEMBERS: '/devotee/members',
  PUT_ACTIVATE_MEMBERS: '/devotee/members/12/activate',
  POST_ADD_VISITORS: '/devotee/visitors',
  PUT_UPDATE_VISITORS: '/devotee/visitors',
  PUT_ACTIVATE_VISITORS: '/devotee/visitors/48/activate',
} as const;

