const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Service = require('./models/Service');
const News = require('./models/News');
const Woreda = require('./models/Woreda');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const services = [
  {
    title: 'መታወቂያ',
    description: 'የነዋሪነት መታወቂያ አገልግሎት ለማግኘት የሚያስፈልጉ መስፈርቶች እና ሂደቶች። አዲስ መታወቂያ፣ እድሳት ወይም ምትክ ለማግኘት።',
    icon: 'RiIdCardFill',
    slug: 'id',
    requirements: ['የቀበሌ መታወቂያ', 'ጉርድ ፎቶግራፍ (3x4)', 'የአገልግሎት ክፍያ ብር 50']
  },
  {
    title: 'ልደት',
    description: 'የልደት የምስክር ወረቀት ለማግኘት። ለህጻናት እና ለአዋቂዎች የሚሰጥ አገልግሎት።',
    icon: 'RiCake2Fill',
    slug: 'birth',
    requirements: ['የሆስፒታል የልደት ካርድ', 'የወላጆች መታወቂያ', 'ጉርድ ፎቶግራፍ']
  },
  {
    title: 'ያላገባ',
    description: 'ያላገባ የምስክር ወረቀት (Unmarried Certificate) አገልግሎት። ለትምህርት፣ ለስራ ወይም ለሌላ ጉዳይ።',
    icon: 'RiFileWarningFill',
    slug: 'single',
    requirements: ['የቀበሌ መታወቂያ', '3 ምስክሮች መታወቂያ ጋር', 'የአገልግሎት ክፍያ']
  },
  {
    title: 'ጋብቻ',
    description: 'የጋብቻ የምስክር ወረቀት አገልግሎት።',
    icon: 'RiHeartAddFill',
    slug: 'marriage',
    requirements: ['የሁለቱም ተጋቢዎች መታወቂያ', 'የምስክሮች መታወቂያ', 'ጉርድ ፎቶግራፍ']
  },
  {
    title: 'ሞት',
    description: 'የሞት የምስክር ወረቀት አገልግሎት።',
    icon: 'RiHealthBookFill',
    slug: 'death',
    requirements: ['የሆስፒታል የሞት ማስረጃ', 'የጠያቂው መታወቂያ']
  }
];

const news = [
  {
    title: 'የአዲስ አበባ ከተማ አስተዳደር የህዝብ ተወካዮች ም/ቤት ጉባኤ ተካሄደ',
    content: 'የአዲስ አበባ ከተማ አስተዳደር የህዝብ ተወካዮች ም/ቤት 1ኛ ዓመት የስራ ዘመን 3ኛ መደበኛ ጉባኤውን አካሄደ። በጉባኤው ላይ የተለያዩ አዋጆች እና ደንቦች ጸድቀዋል።',
    image: '/img/news-1.jpg',
    date: new Date()
  },
  {
    title: 'የክፍለ ከተማው አስተዳደር ከነዋሪዎች ጋር ውይይት አደረገ',
    content: 'የክፍለ ከተማው ዋና ስራ አስፈጻሚ ከወረዳ 1 እና 2 ነዋሪዎች ጋር በልማት እና መልካም አስተዳደር ዙሪያ ሰፊ ውይይት አድርገዋል።',
    image: '/img/slide-2.jpg',
    date: new Date()
  },
  {
    title: 'አዲስ የተገነቡ ፕሮጀክቶች ተመረቁ',
    content: 'በክፍለ ከተማው በተለያዩ ወረዳዎች የተገነቡ ትምህርት ቤቶች፣ ጤና ጣቢያዎች እና የመንገድ ፕሮጀክቶች በክብር እንግዶች ተመርቀው ለአገልግሎት ክፍት ሆነዋል።',
    image: '/img/slide-3.jpg',
    date: new Date()
  }
];

const woredas = [
  {
    name: 'ወረዳ 01',
    description: 'በአዲስ ከተማ ክፍለ ከተማ የሚገኝ ወረዳ።',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15762.613393527838!2d38.7303866!3d9.0305886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8f679717c38d%3A0x642456455584882!2sAddis%20Ketema%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1718804677271!5m2!1sen!2set',
    managerName: 'አቶ ከበደ አለሙ',
    managerPhone: '+251 911 223344',
  },
  {
    name: 'ወረዳ 02',
    description: 'በአዲስ ከተማ ክፍለ ከተማ የሚገኝ ወረዳ።',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15762.613393527838!2d38.7403866!3d9.0305886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8f679717c38d%3A0x642456455584882!2sAddis%20Ketema%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1718804677271!5m2!1sen!2set',
    managerName: 'ወ/ሮ አልማዝ ተፈራ',
    managerPhone: '+251 911 556677',
  }
];

const importData = async () => {
  try {
    await Service.deleteMany();
    await User.deleteMany();
    await News.deleteMany();
    await Woreda.deleteMany();

    await Service.insertMany(services);
    await News.insertMany(news);
    await Woreda.insertMany(woredas);

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@crrsa.gov.et',
      password: hashedPassword,
      isAdmin: true
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
