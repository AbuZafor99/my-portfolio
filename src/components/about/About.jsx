import React from 'react'
import './about.css'
import myImage from '../../assets/my-image1.png'
import {GiGraduateCap} from 'react-icons/gi'
import {BsBookmarkStar} from 'react-icons/bs'
import {TfiWorld} from 'react-icons/tfi'

const About = () => {
  return (
    <section id='about'>
      <h5>Get To Know</h5>
      <h2>About Me</h2>

      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={myImage} alt="Me" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className='about__card'>
              <GiGraduateCap className='about__icon'/>
              <h5>Degree</h5>
              <small>BSc in Computer Science and Engineering<br/><i>Independent University, Bangladesh</i></small>
            </article>

            <article className='about__card'>
              <BsBookmarkStar className='about__icon'/>
              <h5>Current CGPA</h5>
              <small>3.60</small>
            </article>

            <article className='about__card'>
              <TfiWorld className='about__icon'/>
              <h5>Domains</h5>
              <small>
                <ul>
                  <li>Web Development</li>
                  <li>Mobile Applications</li>
                  <li>Software Engineering</li>
                </ul>
              </small>
            </article>
          </div>
          <p>
            I'm a Computer Science and Engineering student at Independent University, Bangladesh. 
            I'm passionate about software development and have a strong academic record with a CGPA of 3.60. 
            My focus areas include web development, mobile applications, and software engineering. 
            I'm always eager to learn new technologies and take on challenging projects.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About