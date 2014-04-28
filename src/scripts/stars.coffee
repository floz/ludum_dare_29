class Stars

    create: ->
        cnt = document.getElementById "stars"

        frag = document.createDocumentFragment()
        for i in [0...250]
            star = document.createElement "div"
            star.innerHTML = "+"
            star.classList.add "star"
            star.classList.add "star--" + ( Math.random() * 2 >> 0 )
            star.style.left = Math.random() * 1700 + "px"
            star.style.top = Math.random() * 1400 + "px"
            frag.appendChild star

        cnt.appendChild frag

module.exports = new Stars()
