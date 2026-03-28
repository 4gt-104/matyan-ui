import * as React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
} from '@material-ui/core';

import { Icon, Text } from 'components/kit';
import CodeBlock from 'components/CodeBlock/CodeBlock';

import { DOCUMENTATIONS } from 'config/references';

import './MatyanIntegrations.scss';

function MatyanIntegrations() {
  const [expanded, setExpanded] = React.useState<number | boolean>(0);

  const handleChange =
    (panel: number) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const integrations = [
    {
      title: 'Integrate PyTorch Lightning',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.PYTORCH_LIGHTNING,
      code: `from matyan_client.adapters.pytorch_lightning import MatyanLogger

# ...
trainer = pl.Trainer(logger=MatyanLogger(experiment='experiment_name'))
# ...`,
    },
    {
      title: 'Integrate Hugging Face',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.HUGGING_FACE,
      code: `from matyan_client.adapters.hugging_face import MatyanCallback

# ...
matyan_callback = MatyanCallback(repo='/path/to/logs/dir', experiment='mnli')
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset if training_args.do_train else None,
    eval_dataset=eval_dataset if training_args.do_eval else None,
    callbacks=[matyan_callback],
    # ...
)
# ...`,
    },
    {
      title: 'Integrate Keras & tf.keras',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.KERAS,
      code: `from matyan_client.adapters.keras import MatyanCallback as KerasMatyanCallback
from matyan_client.adapters.tensorflow import MatyanCallback as TensorflowMatyanCallback

# ...
model.fit(x_train, y_train, epochs=epochs, callbacks=[
    KerasMatyanCallback(repo='/path/to/logs/dir', experiment='experiment_name'),
    
    # Use matyan.tensorflow.MatyanCallback in case of tf.keras
    TensorflowMatyanCallback(repo='/path/to/logs/dir', experiment='experiment_name')
])
# ...`,
    },
    {
      title: 'Integrate KerasTuner',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.KERAS_TUNER,
      code: `from matyan_client.adapters.keras_tuner import MatyanCallback

# ...
tuner.search(
    train_ds,
    validation_data=test_ds,
    callbacks=[MatyanCallback(tuner=tuner, repo='.', experiment='keras_tuner_test')],
)
# ...`,
    },
    {
      title: 'Integrate XGBoost',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.XGBOOST,
      code: `from matyan_client.adapters.xgboost import MatyanCallback

# ...
matyan_callback = MatyanCallback(repo='/path/to/logs/dir', experiment='experiment_name')
bst = xgb.train(param, xg_train, num_round, watchlist, callbacks=[matyan_callback])
# ...`,
    },
    {
      title: 'Integrate CatBoost',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.CATBOOST,
      code: `from matyan_client.adapters.catboost import MatyanLogger

# ...
model.fit(train_data, train_labels, log_cout=MatyanLogger(loss_function='Logloss'), logging_level="Info")
# ...`,
    },
    {
      title: 'Integrate fastai',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.FASTAI,
      code: `from matyan_client.adapters.fastai import MatyanCallback

# ...
learn = cnn_learner(dls, resnet18, pretrained=True,
                    loss_func=CrossEntropyLossFlat(),
                    metrics=accuracy, model_dir="/tmp/model/",
                    cbs=MatyanCallback(repo='.', experiment='fastai_test'))
# ...`,
    },
    {
      title: 'Integrate LightGBM',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.LIGHT_GBM,
      code: `from matyan_client.adapters.lightgbm import MatyanCallback

# ...
matyan_callback = MatyanCallback(experiment='lgb_test')
matyan_callback.experiment['hparams'] = params

gbm = lgb.train(params,
                lgb_train,
                num_boost_round=20,
                valid_sets=lgb_eval,
                callbacks=[matyan_callback, lgb.early_stopping(stopping_rounds=5)])
# ...`,
    },

    {
      title: 'Integrate PyTorch Ignite',
      docsLink: DOCUMENTATIONS.INTEGRATIONS.PYTORCH_IGNITE,
      code: `from matyan_client.adapters.pytorch_ignite import MatyanLogger

# ...
matyan_logger = MatyanLogger()

matyan_logger.log_params({
    "model": model.__class__.__name__,
    "pytorch_version": str(torch.__version__),
    "ignite_version": str(ignite.__version__),
})

matyan_logger.attach_output_handler(
    trainer,
    event_name=Events.ITERATION_COMPLETED,
    tag="train",
    output_transform=lambda loss: {'loss': loss}
)
# ...`,
    },
  ];

  return (
    <div className='MatyanIntegrations'>
      <Text tint={100} weight={600} size={18}>
        Integrate Matyan with your favorite ML framework
      </Text>
      <div className='MatyanIntegrations__section'>
        {integrations.map((item, i) => (
          <Accordion
            key={item.title}
            expanded={expanded === i}
            onChange={handleChange(i)}
            className='MatyanIntegrations__section__accordion'
          >
            <AccordionSummary
              aria-controls='panel1d-content'
              id='panel1d-header'
              expandIcon={<Icon name='arrow-down' fontSize={12} />}
              className='MatyanIntegrations__section__accordion__summary'
            >
              <Text component='p' size={12} weight={600} tint={100}>
                {item.title}
              </Text>
            </AccordionSummary>
            <AccordionDetails className='MatyanIntegrations__section__accordion__details'>
              <CodeBlock code={item.code} />
              <Text
                component='p'
                size={12}
                weight={600}
                tint={100}
                className='MatyanIntegrations__section__text'
              >
                See documentation{' '}
                <Link
                  target='_blank'
                  href={item.docsLink}
                  rel='noreferrer'
                  className='QuickStart__section__text__link'
                >
                  here
                </Link>
                .
              </Text>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default MatyanIntegrations;
