const out_fade = document.querySelectorAll('.fade-out');
const in_fade = document.querySelector('.fade-in');
const section_2 = document.querySelector('.section_2');
const section_3 = document.querySelector('.section_3');

const disappearOptions = {
    root: null,
    threshold: 0.95,
};

const disappearOnScroll = new IntersectionObserver(function(entries, disappearOnScroll) {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            return;
        }else{
            entry.target.classList.add('disappear');
            in_fade.classList.add('appear');
            section_2.classList.add('appear');
            section_3.classList.add('appear');
            disappearOnScroll.unobserve(entry.target);
        }
    })
}, disappearOptions);

out_fade.forEach(out_fade => {
    disappearOnScroll.observe(out_fade);
});