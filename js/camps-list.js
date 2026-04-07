(function () {
  var stateNames = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
    CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
    FL: "Florida", GA: "Georgia", HI: "Hawaii", IA: "Iowa", ID: "Idaho",
    IL: "Illinois", IN: "Indiana", KS: "Kansas", KY: "Kentucky",
    LA: "Louisiana", MA: "Massachusetts", MD: "Maryland", ME: "Maine",
    MI: "Michigan", MN: "Minnesota", MO: "Missouri", MS: "Mississippi",
    MT: "Montana", NC: "North Carolina", ND: "North Dakota", NE: "Nebraska",
    NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NV: "Nevada",
    NY: "New York", OH: "Ohio", OK: "Oklahoma", OR: "Oregon",
    PA: "Pennsylvania", PR: "Puerto Rico", RI: "Rhode Island",
    SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas",
    UT: "Utah", VA: "Virginia", VT: "Vermont", WA: "Washington",
    WI: "Wisconsin", WV: "West Virginia", WY: "Wyoming",
  };

  var typeLabels = {
    high_adventure: "National High Adventure",
    council_high_adventure: "Council High Adventure",
    council_camp: "Council Camp",
  };

  function typeClass(type) {
    if (type === "high_adventure") return "high-adventure";
    if (type === "council_high_adventure") return "council-high-adventure";
    return "council-camp";
  }

  function buildCampCard(props) {
    var html = '<div class="camp-card">';
    html += '<div class="camp-card-header">';
    html += "<h3>" + props.name + "</h3>";
    if (props.logo) {
      html +=
        '<img class="camp-logo" src="' +
        props.logo +
        '" alt="' +
        props.name +
        ' logo">';
    }
    html += "</div>";
    html +=
      '<span class="type-badge ' +
      typeClass(props.type) +
      '">' +
      typeLabels[props.type] +
      "</span>";

    if (props.council) {
      html +=
        '<div class="detail"><strong>' + props.council + "</strong></div>";
    }

    if (props.address) {
      html += '<div class="detail">' + props.address + "</div>";
    } else if (props.city || props.country) {
      var location = props.city || "";
      if (props.city && props.country) location += ", ";
      if (props.country) location += props.country;
      html += '<div class="detail">' + location + "</div>";
    }

    if (props.website) {
      html +=
        '<div class="detail"><a href="' +
        props.website +
        '" target="_blank" rel="noopener">Visit Website</a></div>';
    }

    if (props.description) {
      html += '<p class="description">' + props.description + "</p>";
    }

    html += "</div>";
    return html;
  }

  fetch("data/camps.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var byState = {};
      data.features.forEach(function (f) {
        var state = f.properties.state || "Other";
        if (!byState[state]) byState[state] = [];
        byState[state].push(f.properties);
      });

      var sortedStates = Object.keys(byState).sort(function (a, b) {
        var nameA = stateNames[a] || a;
        var nameB = stateNames[b] || b;
        return nameA.localeCompare(nameB);
      });

      var container = document.getElementById("camp-list");
      var html = '<div class="list-header">';
      html += "<h2>Camp Directory</h2>";
      html +=
        '<p class="camp-count">' +
        data.features.length +
        " camps across " +
        sortedStates.length +
        " states</p>";
      html += "</div>";

      html += '<nav class="state-nav">';
      sortedStates.forEach(function (state) {
        var label = stateNames[state] || state;
        html +=
          '<a href="#state-' +
          state +
          '">' +
          label +
          " (" +
          byState[state].length +
          ")</a>";
      });
      html += "</nav>";

      sortedStates.forEach(function (state) {
        var label = stateNames[state] || state;
        html +=
          '<section class="state-section" id="state-' + state + '">';
        html +=
          "<h2>" +
          label +
          ' <span class="state-count">' +
          byState[state].length +
          "</span></h2>";
        html += '<div class="camp-grid">';

        byState[state]
          .sort(function (a, b) {
            return a.name.localeCompare(b.name);
          })
          .forEach(function (props) {
            html += buildCampCard(props);
          });

        html += "</div></section>";
      });

      container.innerHTML = html;
    });
})();
