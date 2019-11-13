import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container, Image } from "semantic-ui-react"
import img from "../images/100_3363-1024x771.jpg"
import aboutStyles from "../styles/about.module.css"

const About = () => {
  return (
    <Layout>
      <SEO title="About" />
      <Container>
        <h1>About</h1>
        <p className={aboutStyles.paragraph}>
          The Watershed Project is a nonprofit based in Richmond, CA, whose
          mission is to inspire Bay Area communities to
          understand,largeppreciate, and protect our local watersheds. We hope
          that this website will help people learn about water quality and be
          interested in investigating their local creeks. Find out more about
          The Watershed Project at
          <a href="http://thewatershedproject.org/">
            www.thewatershedproject.org
          </a>
          .
        </p>
        <Image src={img} size="medium" className={aboutStyles.textWarp} />
        <p className={aboutStyles.paragraph}>
          We could use your help! Our monitoring technicians need volunteers to
          help them collect their monthly data. Volunteers learn how to record
          data and use the water quality meters, and get to visit creek sites
          throughout Contra Costa County. Monitoring days last from about
          9am-2pm, and are typically during the second week of the month. Please
          contact Helen Fitanides at{" "}
          <a href="mailto:helen@thewatershedproject.org">
            helen@thewatershedproject.org
          </a>{" "}
          for more information.
        </p>
        <h2>Methods</h2>
        <p className={aboutStyles.paragraph}>
          We follow protocols found in the California Waterboards Surface Water
          Ambient Monitoring Program’s{" "}
          <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/cwt_guidance.html">
            Clean Water Team Guidance Compendium for Watershed Monitoring and
            Assessment
          </a>
          for all of our monitoring activities. We calibrate meters before each
          monitoring day, check their accuracy after monitoring, and collect
          multiple data points per feature so that we can calculate field
          precision, ensuring our data is accurate and replicable. For more
          information on methods, please contact Helen Fitanides at{" "}
          <a href="mailto:helen@thewatershedproject.org">
            helen@thewatershedproject.org
          </a>
          .
        </p>
        <p className={aboutStyles.paragraph}>
          Water Quality <b>Thresholds</b> are values of each feature, above or
          below which data is considered not ideal. For example, trout need
          water to be below 24 degrees Celsius, so that is the temperature
          threshold; any temperature data above 24 degrees Celsius is considered
          not ideal. Another example is dissolved oxygen: most aquatic life need
          at least 5 milligrams per liter of oxygen dissolved in the water to
          survive, and so any values below that are considered not ideal. Any
          data collected within the acceptable range is considered ideal.
        </p>
        <p className={aboutStyles.paragraph}>
          Assessing creek health in urban streams can be tricky because most of
          these areas will never be pristine again, and the same is true of the
          water quality in the creeks. For example, while the EPA states that
          conductivity in streams should be between 50-500 uS/cm to best support
          aquatic life, other sources indicate that conductivity is not a
          “problem” in urban streams until it surpasses 2,000 uS/cm. While it is
          good to keep these differences in mind, for this application we’ve
          used the thresholds that are deemed best to support aquatic life
          rather than what is to be expected in urban streams.
        </p>
        <p className={aboutStyles.paragraph}>
          For Vital Water Quality Features, for which data is collected monthly,
          <b> Feature Scores</b> are calculated based on the proportion of time
          a water quality feature was within the acceptable range.
          <ul>
            <li>Good = if proportion is .9 or greater</li>
            <li>Marginal = if proportion is between .9 and .5</li>
            <li>Bad = if proportion is less than .5</li>
          </ul>
        </p>
        <p className={aboutStyles.paragraph}>
          <b>Creek Grades</b> combines the Feature Scores to get an overall
          grade for the creek as a whole, based on the sites monitored. 0 points
          are given to Bad scores, 1 point is given to Marginal scores, and 2
          points are given to Good scores. Finally, the points are summed for
          each creek and divided by the total possible points to get an overall
          grade of Good, Marginal, or Bad.
        </p>
      </Container>
    </Layout>
  )
}

export default About
