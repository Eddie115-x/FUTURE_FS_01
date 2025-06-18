
import React from 'react';
import './About.css';

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container" data-aos="fade-up">
        <h1 className="about-title">About Me</h1>
        <div className="about-content">
          <img
            src="/assets/about-pic.png"
            alt="Profile"
            className="about-image"
          />
          <div className="about-text">
            <p>
              My journey into tech wasn’t straightforward. I started out as a pure science student in high school,
              unsure of what path to follow after graduation. Everything changed after Year 12 when I discovered coding —
              and I haven’t looked back since. Today, I’m a third-year Software Engineering student at the University of the South Pacific in Laucala, Fiji.
              Over the past two years, I’ve worked on various academic and personal projects, including mobile applications and websites.
              Every challenge has been a learning curve — and this portfolio is proof that I’m moving in the right direction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
