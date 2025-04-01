import React from 'react'
import './footer.css'
import {BsLinkedin} from 'react-icons/bs'
import {BsGithub} from 'react-icons/bs'
import {BsMedium} from 'react-icons/bs'
import {BsFacebook} from 'react-icons/bs'
const Footer = () => {
  return (
    <footer>
        <a href="#home" className='footer__logo'>Abu Zafor</a>
        <ul className="permalinks">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#myprojects">My Projects</a></li>
        </ul>

        <div className="footer__socials">
          <a href="https://www.linkedin.com/in/md-abu-zafor-925b15235/" target="_blank" rel='noreferrer'><BsLinkedin/></a>
          <a href="https://github.com/AbuZafor99" target="_blank" rel='noreferrer'><BsGithub/></a>
          <a href="https://medium.com/" target="_blank" rel='noreferrer'><BsMedium/></a>
          <a href="https://www.facebook.com/zafor.sadiq.16" target="_blank" rel='noreferrer'><BsFacebook/></a>
        </div>

        <div className="footer__copyright">
            <small>&copy; AbuZafor. All rights reserved.</small>
        </div>
    </footer>
  )
}

export default Footer