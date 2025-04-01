import React from 'react'
import {BsLinkedin} from 'react-icons/bs'
import {BsGithub} from 'react-icons/bs'
import {BsMedium} from 'react-icons/bs'
import {BsFacebook} from 'react-icons/bs'
const HeaderSocials = () => {
  return (
    <div className="header__socials">
       <a href="https://www.linkedin.com/in/md-abu-zafor-925b15235/" target="_blank" rel='noreferrer'><BsLinkedin/></a>
       <a href="https://github.com/AbuZafor99" target="_blank" rel='noreferrer'><BsGithub/></a>
       <a href="https://medium.com/" target="_blank" rel='noreferrer'><BsMedium/></a>
       <a href="https://www.facebook.com/zafor.sadiq.16" target="_blank" rel='noreferrer'><BsFacebook/></a>
    </div>
  )
}

export default HeaderSocials