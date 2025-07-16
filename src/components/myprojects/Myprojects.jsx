import React from 'react'
import './myprojects.css'
import IMG1 from '../../assets/campus-aid.png'
import IMG2 from '../../assets/todo.png'
import IMG3 from '../../assets/portfolio.png'


const Myprojects = () => {
  return (
    <section id='myprojects'>
      <h5>My Recent Works</h5>
      <h2>Projects</h2>

      <div className="container portfolio__container">
        <article className='portfolio__item'>
          <div className="portfolio__item-image">
            <img src={IMG1} alt="Project 1" />
          </div>
          <h3>Campus- Aid</h3>
          <small className='text-light'>HTML | CSS | JS</small>
          <div className="portfolio__item-cta">
            <a href="https://github.com/AbuZafor99/CGPA-Calculator" target="_blank" rel='noreferrer' className='btn'>Github</a>
            <a href="https://campus-aid.netlify.app/" target="_blank" rel='noreferrer' className='btn btn-primary'>Live Demo</a>
          </div>
        </article>

        <article className='portfolio__item'>
          <div className="portfolio__item-image">
            <img src={IMG2} alt="Project 2" />
          </div>
          <h3>ToDo Management App</h3>
          <small className='text-light'>Java | SQLite | XML</small>
          <div className="portfolio__item-cta">
            <a href="https://github.com/AbuZafor99/Todo-App" target="_blank" rel='noreferrer' className='btn'>Github</a>
            <a href="#" target="_blank" rel='noreferrer' className='btn btn-primary'>Live Demo</a>
          </div>
        </article>

        <article className='portfolio__item'>
          <div className="portfolio__item-image">
            <img src={IMG3} alt="Project 3" />
          </div>
          <h3>Portfolio Website</h3>
          <small className='text-light'>React | CSS3 | JavaScript</small>
          <div className="portfolio__item-cta">
            <a href="https://github.com/AbuZafor99/" target="_blank" rel='noreferrer' className='btn'>Github</a>
            <a href="https://abuzafor.github.io/portfolio" target="_blank" rel='noreferrer' className='btn btn-primary'>Live Demo</a>
          </div>
        </article>

        {/* <article className='portfolio__item'>
          <div className="portfolio__item-image">
            <img src={IMG4} alt="Project 4" />
          </div>
          <h3>Weather App</h3>
          <small className='text-light'>React | OpenWeather API</small>
          <div className="portfolio__item-cta">
            <a href="https://github.com/abuzafor/weather-app" target="_blank" rel='noreferrer' className='btn'>Github</a>
            <a href="https://weather-app-demo.com" target="_blank" rel='noreferrer' className='btn btn-primary'>Live Demo</a>
          </div>
        </article> */}
      </div>
    </section>
  )
}

export default Myprojects