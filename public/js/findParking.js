import axios from 'axios';
import { showAlert } from './alert';

export const showMap = (findParkingBtn) => {
  findParkingBtn.addEventListener(`click`, () => {
    window.setTimeout(() => {
      location.assign(`/findParking`);
    }, 500);
  });
};

export const displayMap = (parkings) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hhdWhhbmRocnV2MjQ1IiwiYSI6ImNsdThjOXIyMjBjcjMyanBpbG5xN3RrZzkifQ.Xcn3mM3iZUlacqCGvPfwvA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    scrollZoom: false,
  });
  const bounds = new mapboxgl.LngLatBounds();
  parkings.forEach((parking) => {
    const el = document.createElement(`div`);
    el.className = `marker`;
    if (parking.role === `public`) {
      el.className = `marker-public`;
    } else {
      el.className = `marker-private`;
    }
    el.addEventListener(`click`, () => {
      location.assign(`/parking/${parking.slug}`);
    });
    new mapboxgl.Marker({
      element: el,
      anchor: `bottom`,
    })
      .setLngLat(parking.location.coordinates)
      .addTo(map);
    bounds.extend(parking.location.coordinates);
    new mapboxgl.Popup({
      offset: 30,
      closeOnClick: false,
    })
      .setLngLat(parking.location.coordinates)
      .setHTML(`<p>${parking.name}</p>`)
      .addTo(map);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      right: 200,
      left: 200,
    },
  });
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );
  const legend = document.createElement('div');
  legend.id = 'legend';
  legend.innerHTML = `
  <h3 class="legend-private"><span><img class="legend-private-pin" src="./../img/pin.png"></span>Private Parkings</h3>
  <h3 class="legend-public"><span><img class="legend-public-pin" src="./../img/pin.png"></span>Public Parkings</h3>
`;
  map.getContainer().appendChild(legend);
};
export const toggleSearch = (search, button) => {
  const searchBar = document.getElementById(search),
    searchButton = document.getElementById(button);

  searchButton.addEventListener('click', () => {
    searchBar.classList.toggle('show-search');
  });
};

export const getParkingsNearMe = async (distance, latlng, unit) => {
  try {
    const res = await axios({
      method: `GET`,
      url: `http://localhost:3000/api/v1/parkings/parkings-within/${distance}/center/${latlng}/unit/${unit}`,
    });
    if (res.data.status === `success`) {
      const parkings = res.data.data.data;
      if (parkings.length === 0) {
        showAlert(`error`, `No parkings found near you`);
      } else {
        displayMap(parkings);
      }
    }
  } catch (err) {
    showAlert(`error`, err.response.data.message);
  }
};

