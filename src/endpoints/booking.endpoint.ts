export const BOOKING_ENDPOINTS = {
    GET_CHECK_AVAILABILITY: '/booking/checkAvailability?fromDate=09-08-2025&toDate=10-08-2025&type=Family&guestCount=5&category=Regular',
    POST_NEW_REGULAR_BOOKING: '/booking/regular/process',
    GET_MY_BOOKING_LIST: '/booking/list',
    GET_MY_BOOKING_DETAILS: '/booking/list/1200132770',
    GET_UPCOMING_UTSAV_LISTS: '/booking/utsavs',
    POST_NEW_UTSAV_BOOKING: '/booking/utsav/process',
    GET_CANCELLATION_REASONS: '/booking/cancel/reasons',
} as const;

