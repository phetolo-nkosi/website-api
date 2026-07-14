let caseStudies = [];

async function loadCaseStudies() {

    try {

        const response = await fetch("/api/case-studies");

        const result = await response.json();

        caseStudies = result.data;

        displayCaseStudies(caseStudies);

    }

    catch (err) {

        console.error(err);

    }

}

function displayCaseStudies(data) {

    const container = document.getElementById("caseStudies");

    container.innerHTML = "";

    data.forEach(cs => {

        container.innerHTML += `

        <div class="card">

            <img src="${cs.Hero_Image || 'images/default.jpg'}">

            <div class="card-content">

                <span class="industry">
                    ${cs.Industry}
                </span>

                <h2>${cs.Title}</h2>

                <p>${cs.Summary}</p>

                <a
                    href="case-study.html?slug=${cs.Slug}"
                    class="read-more">

                    Read Case Study →

                </a>

            </div>

        </div>

        `;

    });

}

document
    .getElementById("searchInput")
    .addEventListener("keyup", function () {

        const search = this.value.toLowerCase();

        const filtered = caseStudies.filter(cs => {

            return (

                cs.Title.toLowerCase().includes(search)

                ||

                cs.Industry.toLowerCase().includes(search)

                ||

                cs.Summary.toLowerCase().includes(search)

            );

        });

        displayCaseStudies(filtered);

    });

loadCaseStudies();