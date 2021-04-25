import React from "react"
import PropTypes from "prop-types"

import { Page, Card } from '@shopify/polaris';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function PrintPreview(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Page fullHeight>
        <Card>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Button
                    variant="contained"
                    color="secondary"
                  >
                    Upload
                    <input
                      type="file"
                      hidden
                    />
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Button
                    variant="contained"
                    color="secondary"
                  >
                    Fetch
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Card>
      </Page>
    </React.Fragment>
  );
}
