const woreda =[
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""},
  {name : "አዲስ ከተማ ወረዳ 03" , manager : "አቶ የሱፍ", phone : "+251913652342", address : "አማኑኤል", location : ""},
  {name : "አዲስ ከተማ ወረዳ 04" , manager : "አቶ እከሌ", phone : "+251913652342", address : "ሰፈረ ሰላም ከኢትዮ-ጠቢብ ሆሰፒታል ፊት ለፊት 100ሜ ገባ ብሎ", location : ""},
  {name : "አዲስ ከተማ ወረዳ 05" , manager : "አቶ እከሌ", phone : "+251913652342", address : "", location : ""},
  {name : "አዲስ ከተማ ወረዳ 06" , manager : "አቶ ባ", phone : "+251913652342", address : "ከፓስተር ወደ አቶቢስተራ በሚወስደው መንገድ", location : ""},
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""},
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""},
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""},
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""},
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""},
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""},
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""},
  {name : "አዲስ ከተማ ወረዳ 01" , manager : "አቶ ባህሩ አወል", phone : "+251913652342", address : "መርካቶ በርበሬ በረንዳ መብራት ጋር", location : ""}
] 

const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId)
 
    toggle.addEventListener('click', () =>{
        // Add show-menu class to nav menu
        nav.classList.toggle('show-menu')
 
        // Add show-icon to show and hide the menu icon
        toggle.classList.toggle('show-icon')
    })
 }
 
 showMenu('nav-toggle','nav-menu')
 const tabs = document.querySelectorAll('.tab_btn');
 const all_content = document.querySelectorAll('.contant');

 tabs.forEach((tab, index)=>{
    tab.addEventListener('click', (e)=>{
        tabs.forEach(tab=>{tab.classList.remove('active')});
        tab.classList.add('active');
        // var line=document.querySelector('.line');
        // line.style.width = e.target.offsetwidth + "px";
        // line.style.left = e.target.offsetleft + "px";
        all_content.forEach(content=>{content.classList.remove('active')});
        all_content[index].classList.add('active');
    });
 });
 const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentSlide = 0;

  function showSlide(n) {
    slider.style.transform = `translateX(-${n * 100}%)`;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length; // Handle negative indices
    showSlide(currentSlide);
  }

  // nextBtn.addEventListener('click', nextSlide);
  // prevBtn.addEventListener('click', prevSlide);