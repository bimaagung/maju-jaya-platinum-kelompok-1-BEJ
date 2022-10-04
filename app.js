// let apm = require('elastic-apm-node');

// apm.start({
//   serviceName: process.env.PLATINUM_MAJU_JAYA,
//   secretToken: '',

//   serverUrl: `http://${process.env.SERVER_URL}:8200`,
//   environment: 'development',
// });

const express = require('express');

const app = express();
const swaggerUi = require('swagger-ui-express'); // import swagger
let morgan = require('morgan');

const serverError = require('./middleware/serverError');

const CategoryRepository = require('./repository/category');
const CategoryUseCase = require('./usecase/category');

const AddressRepository = require('./repository/address');
const AddressUseCase = require('./usecase/address');

const ProductUseCase = require('./usecase/product');
const ProductRepository = require('./repository/product');

const OrderUseCase = require('./usecase/order');

const OrderRepository = require('./repository/order');
const OrderDetailRepository = require('./repository/orderDetail');

const UserRepository = require('./repository/user');
const UserUseCase = require('./usecase/user');

const AuthRepository = require('./repository/auth')
const AuthUseCase = require('./usecase/auth')

app.use(morgan('dev'));

const ProductImageRepository = require('./repository/product_image');
const ProductImageUseCase = require('./usecase/product_image');

const productRouter = require('./routes/product');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const orderRouter = require('./routes/order');
const categoryRouter = require('./routes/category');
const addressRouter = require('./routes/address');
const userRouter = require('./routes/user');

app.use('/public', express.static('public'));

const addressUC = new AddressUseCase(new AddressRepository(), new UserRepository());
const categoryUC = new CategoryUseCase(new CategoryRepository());
const productUC = new ProductUseCase(new ProductRepository(), new CategoryRepository());
const userUC = new UserUseCase(new UserRepository());

const authUC = new AuthUseCase(
  new AuthRepository(),
  new UserRepository()
)

const productImageUC = new ProductImageUseCase(
  new ProductImageRepository(),
  new ProductRepository(),
);
const orderUC = new OrderUseCase(
  new OrderRepository(),
  new OrderDetailRepository(),
  new ProductRepository(),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.categoryUC = categoryUC;
  req.productUC = productUC;
  req.userUC = userUC;
  req.addressUC = addressUC;
  req.productImageUC = productImageUC;
  req.orderUC = orderUC;
  req.authUC = authUC;
  next();
});

app.get('/', (req, res) => {
  // #swagger.ignore = true
  res.send('Hello Platinum Maju Jaya');
});

app.use('/', authRouter);
app.use('/admin', adminRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/address', addressRouter);
app.use('/order', orderRouter);
app.use('/user', userRouter);

// handle server error
app.use(serverError);

const swaggerDocument = require('./docs/docs.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
