import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: "admin",
            email: 'parich.suri@gmail.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
            isSeller: true,
            seller: {
                name: 'dokkooon',
                logo: '/images/product-1.jpg',
                description: 'dokkooon best seller',
                rating: 4.5,
                numReviews: 120,
            },
        },
        {
            name: "suriya",
            email: 'suriya@gmail.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: false,
        },
    ],
    products: [
        {

            name: 'TOYOYA vigo1',
            category: 'vigo',
            image: '/images/product-1.jpg',
            price: 1220,
            brand: 'TOYOYA',
            rating: 4.5,
            countInStock: 10,
            numReviews: 10,
            description: 'TOYOYA vigo สะอาดใหม่ สด'
        },
        {

            name: 'TOYOYA vigo2',
            category: 'vigo',
            image: '/images/product-1.jpg',
            price: 120,
            brand: 'TOYOYA',
            rating: 4.5,
            countInStock: 10,
            numReviews: 10,
            description: 'TOYOYA vigo สะอาดใหม่ สด'
        },
        {

            name: 'TOYOYA vigo3',
            category: 'vigo',
            image: '/images/product-1.jpg',
            price: 120,
            brand: 'TOYOYA',
            rating: 4.5,
            countInStock: 10,
            numReviews: 10,
            description: 'TOYOYA vigo สะอาดใหม่ สด'
        },
        {

            name: 'TOYOYA vigo4',
            category: 'vigo',
            image: '/images/product-1.jpg',
            price: 120,
            brand: 'TOYOYA',
            rating: 4.5,
            countInStock: 0,
            numReviews: 10,
            description: 'TOYOYA vigo สะอาดใหม่ สด'
        },
    ]
}

export default data;