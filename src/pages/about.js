import { setHTML } from "../engine/ui"

let container
let scrollY = 0
let targetScroll = 0
let maxScroll = 0

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function updateMaxScroll() {
  if (!container) return
  const contentHeight = container.scrollHeight
  const viewportHeight = window.innerHeight
  maxScroll = Math.max(0, contentHeight - viewportHeight)
}

function onWheel(e) {
  targetScroll += e.deltaY
  targetScroll = clamp(targetScroll, 0, maxScroll)
}

let touchStart = 0

function onTouchStart(e) {
  touchStart = e.touches[0].clientY
}

function onTouchMove(e) {
  const current = e.touches[0].clientY
  const delta = touchStart - current
  touchStart = current

  targetScroll += delta
  targetScroll = clamp(targetScroll, 0, maxScroll)
}

export function createAbout(scene) {
  return {

    init() {

      setHTML(`
        <div id="resumeScrollRoot">
          <div class="resume-container">
          
            <header class="resume-header">
              <h1>Clara Brook</h1>
              <h2>Software Engineer</h2>
            </header>

            <section class="resume-section">
              <h3>Contact</h3>
              <div class="contact-grid">
                <div><strong>Phone:</strong> +1 (267) 421-7575</div>
                <div><strong>Email:</strong> clarabrook97@gmail.com</div>
                <div><strong>Location:</strong> Philadelphia, PA</div>
                <div><strong>Profile:</strong>
                  <a href="https://linkedin.com/in/clarabrook" target="_blank">
                    linkedin.com/in/clarabrook
                  </a>
                </div>
              </div>
            </section>

            <section class="resume-section">
              <h3>Professional Experience</h3>

              <div class="job">
                <div class="job-header">
                  <strong>Accenture</strong>
                  <span>May 2022 – Present</span>
                </div>

                <h4>Salesforce Analyst</h4>
                <ul>
                  <li>Member of Technology Delivery Program providing floating technical support.</li>
                  <li>Specialized in Salesforce development and business analysis.</li>
                  <li>Certifications: Platform Developer I, JavaScript Developer, Administrator.</li>
                </ul>

                <h4>Cloud Software Developer</h4>
                <p class="job-project">Project: Major Insurance Provider</p>

                <ul>
                  <li>Delivered 40+ product releases in CI/CD Agile sprint cycles.</li>
                  <li>Developed LWCs, Apex triggers, flows, and Lightning pages supporting 1M+ claimants.</li>
                  <li>Managed integrations with Google Cloud, Caseman, Copado pipelines, and BigQuery reporting.</li>
                  <li>Consulted with external client teams while maintaining internal architecture direction.</li>
                  <li>Mentored three QA testers on programming skills.</li>
                  <li><strong>Skills:</strong> Java, DevOps, Design Patterns, REST/SOAP APIs, SQL, GraphQL, Agentic AI.</li>
                </ul>
              </div>
            </section>

            <section class="resume-section">
              <h3>Education</h3>
              <p>
                <strong>Temple University</strong> — B.A.<br>
                August 2015 – December 2018 · Philadelphia
              </p>
            </section>

            <section class="resume-section">
              <h3>Certificates</h3>
              <p>
                <strong>Tech Elevator Coding Bootcamp</strong><br>
                August 2021 – December 2021 · Philadelphia
              </p>

              <ul>
                <li>Object-Oriented Programming: Java</li>
                <li>Web Development: HTML, CSS, JavaScript, Spring Boot, Vue, React</li>
                <li>Database Programming: JDBC, SQL, PostgreSQL</li>
                <li>Tools: Agile, JUnit, Git, Unix CLI, IntelliJ</li>
              </ul>
            </section>

          </div>
        </div>

        <style>
          #resumeScrollRoot{
            position:absolute;
            top:0;
            left:0;
            width:100%;
            will-change:transform;
          }

          .resume-container{
            max-width:900px;
            margin:auto;
            padding:60px 20px 120px;
            color:white;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto;
            line-height:1.6;
          }

          .resume-header h1{
            font-size:2.5rem;
            margin:0;
          }

          .resume-header h2{
            font-weight:400;
            opacity:0.8;
          }

          .resume-section{
            margin-top:40px;
          }

          .resume-section h3{
            border-bottom:1px solid rgba(255,255,255,0.2);
            padding-bottom:6px;
            margin-bottom:16px;
            text-transform:uppercase;
            font-size:0.9rem;
            letter-spacing:1px;
          }

          .contact-grid{
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
            gap:6px 20px;
          }

          .job-header{
            display:flex;
            justify-content:space-between;
          }

          ul{
            padding-left:18px;
          }

          li{
            margin-bottom:6px;
          }

          a{
            color:#7cc6ff;
          }
        </style>
      `)

      container = document.getElementById("resumeScrollRoot")

      updateMaxScroll()

      window.addEventListener("wheel", onWheel, { passive: true })
      window.addEventListener("touchstart", onTouchStart, { passive: true })
      window.addEventListener("touchmove", onTouchMove, { passive: true })
      window.addEventListener("resize", updateMaxScroll)
    },

    update() {

      if (!container) return

      // smooth scroll interpolation
      scrollY += (targetScroll - scrollY) * 0.9

      container.style.transform = `translateY(${-scrollY}px)`
    },

    cleanup() {

      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("resize", updateMaxScroll)

      container = null
      scrollY = 0
      targetScroll = 0
    }

  }
}