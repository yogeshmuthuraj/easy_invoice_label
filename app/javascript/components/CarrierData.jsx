import React from "react"
import PropTypes from "prop-types"

import Button from '@material-ui/core/Button';

class CarrierData extends React.PureComponent {
  uploadFile() {
    return (
      <Button
        variant="contained"
        component="label"
      >
        Upload File
        <input
          type="file"
          hidden
        />
      </Button>
    )
  }

  mergeCarrierInfo() {
    // merge and sort orders
  }


  render() {
    let segregateCarrier = true; // Switch
    let paperSize = 'A6'; // Dropdown
    let paperOrientation = 'portrait'; // Switch

    return (
      <div>{this.uploadFile()}</div>
    );
  }
}

export default CarrierData
