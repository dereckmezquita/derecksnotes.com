export const userMock: UserDTO = {
    name: { first: 'Dereck', last: 'Mezquita' },
    profilePhotos: ['optimised_dereck_2023-09-28-162359.jpg'],
    email: { address: 'dereck@example.com', verified: false },
    username: 'dereck',
    password: 'testpassword',
    metadata: {
        geolocations: [],
        lastConnected: new Date(),
    }
};

export const userMock2: UserDTO = {
    name: { first: 'Test', last: 'User' },
    profilePhotos: ['optimised_test_user_2023-09-28-162359.jpg'],
    email: { address: 'test@test.com', verified: false },
    username: 'test_user',
    password: 'testpassword',
    metadata: {
        geolocations: [],
        lastConnected: new Date(),
    }
}