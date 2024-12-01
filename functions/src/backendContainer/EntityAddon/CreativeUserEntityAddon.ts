import { models, CreativeUserEntityService } from '@risefunds/sdk';
import { injectable } from 'inversify';

import { BaseEntityAddon, IBaseEntityAddonExtension } from './BaseEntityAddon';

// const CC = 'uyioghosa19@gmail.com';

interface ICreativePaylod {
  creativeId: string;
}

@injectable()
export class CreativeUserEntityAddon
  extends BaseEntityAddon<
    models.CreativeUserEntityModel,
    models.ICreativeUserEntityModel
  >
  implements
    IBaseEntityAddonExtension<
      models.CreativeUserEntityModel,
      models.ICreativeUserEntityModel
    >
{
  addonName = models.CreativeUserEntityModel.collection;
  get entityService(): CreativeUserEntityService {
    return this.BaseService.SDKService.getUnAuthenticatedSDKServices().core
      .CreativeUserEntityService;
  }

  async sendProfileCompletionEmail(userId: string = ''): Promise<void> {
    // const creativeUsers = await this.entityService.where({
    //   params: [
    //     {
    //       key: 'id',
    //       value: userId,
    //       operator: '==',
    //     },
    //     {
    //       key: 'profileCompletionEmailSent',
    //       value: false,
    //       operator: '==',
    //     },
    //     { key: 'portoflioPercentage', value: 85, operator: '<' },
    //     { key: 'archive', value: false, operator: '==' },
    //   ],
    // });
  }

  async sendProfileCompletedEmail(userId: string = ''): Promise<void> {
    const creativeUsers = await this.entityService.where({
      params: [
        { key: 'archive', value: false, operator: '==' },
        {
          key: 'profileCompletedEmailSent',
          value: false,
          operator: '==',
        },
        { key: 'portoflioPercentage', value: 85, operator: '>=' },
        {
          key: 'id',
          value: userId,
          operator: '==',
        },
      ],
    });

    await Promise.all(
      creativeUsers.map(async (creativeUser) => {
        if (creativeUser.email) {
          // const campaigns =
          //   await this.SdkServices.core.CampaignEntityService.whereViaParent({
          //     parentObject: creativeUser,
          //   });

          await this.ExternalAddonService.MailgunExternalAddon.sendEmail({
            from: 'Risefunds Team <mailgun@sandboxc7499b3594524717a7e18b6c3e257f07.mailgun.org>',
            // replyTo: `${creativeUser.email}`,
            to: 'Risefunds <benedictuyioghosa@gmail.com>',
            subject: `We have finished reviewing ${creativeUser.details.firstName} ${creativeUser.details.lastName} Portfolio & Profile.`,
            // cc: CC,
            html: `<!doctype html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width" />
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>Invitation Email</title>
                    <style>
                      /* -------------------------------------
                          GLOBAL RESETS
                      ------------------------------------- */
                      img {
                        border: none;
                        -ms-interpolation-mode: bicubic;
                        max-width: 100%; }
                
                      body {
                        background-color: #f6f6f6;
                        font-family: sans-serif;
                        -webkit-font-smoothing: antialiased;
                        font-size: 14px;
                        line-height: 1.4;
                        margin: 0;
                        padding: 0;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%; }
                
                      table {
                        border-collapse: separate;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        width: 100%; }
                        table td {
                          font-family: sans-serif;
                          font-size: 14px;
                          vertical-align: top; }
                
                      /* -------------------------------------
                          BODY & CONTAINER
                      ------------------------------------- */
                
                      .body {
                        background-color: #f6f6f6;
                        width: 100%; }
                
                      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                      .container {
                        display: block;
                        margin: 0 auto !important;
                        /* makes it centered */
                        max-width: 580px;
                        padding: 10px;
                        width: 580px; }
                
                      /* This should also be a block element, so that it will fill 100% of the .container */
                      .content {
                        box-sizing: border-box;
                        display: block;
                        margin: 0 auto;
                        max-width: 580px;
                        padding: 10px; }
                
                      /* -------------------------------------
                          HEADER, FOOTER, MAIN
                      ------------------------------------- */
                      .main {
                        background: #ffffff;
                        border-radius: 3px;
                        width: 100%; }
                
                      .wrapper {
                        box-sizing: border-box;
                        padding: 20px; }
                
                      .content-block {
                        padding-bottom: 10px;
                        padding-top: 10px;
                      }
                
                      .footer {
                        clear: both;
                        margin-top: 10px;
                        text-align: center;
                        width: 100%; }
                        .footer td,
                        .footer p,
                        .footer span,
                        .footer a {
                          color: #999999;
                          font-size: 12px;
                          text-align: center; }
                
                      /* -------------------------------------
                          TYPOGRAPHY
                      ------------------------------------- */
                      h1,
                      h2,
                      h3,
                      h4 {
                        color: #000000;
                        font-family: sans-serif;
                        font-weight: 400;
                        line-height: 1.4;
                        margin: 0;
                        margin-bottom: 30px; }
                
                      h1 {
                        font-size: 35px;
                        font-weight: 300;
                        text-align: center;
                        text-transform: capitalize; }
                
                      p,
                      ul,
                      ol {
                        font-family: sans-serif;
                        font-size: 14px;
                        font-weight: normal;
                        margin: 0;
                        margin-bottom: 15px; }
                        p li,
                        ul li,
                        ol li {
                          list-style-position: inside;
                          margin-left: 5px; }
                
                      a {
                        color: #000;
                        text-decoration: underline; }
                
                      /* -------------------------------------
                          BUTTONS
                      ------------------------------------- */
                      .btn {
                        box-sizing: border-box;
                        width: 100%; }
                        .btn > tbody > tr > td {
                          padding-bottom: 15px; }
                        .btn table {
                          width: auto; }
                        .btn table td {
                          background-color: #ffffff;
                          border-radius: 5px;
                          text-align: center; }
                        .btn a {
                          border: solid 1px #000;
                          box-sizing: border-box;
                          color: #000;
                          cursor: pointer;
                          display: inline-block;
                          font-size: 14px;
                          font-weight: bold;
                          margin: 0;
                          padding: 12px 25px;
                          text-decoration: none;
                          text-transform: capitalize; }
                
                      .btn-primary table td {
                        background-color: #000; }
                
                      .btn-primary a {
                        border-color: #000;
                        color: #ffffff; }
                
                      /* -------------------------------------
                          OTHER STYLES THAT MIGHT BE USEFUL
                      ------------------------------------- */
                      .last {
                        margin-bottom: 0; }
                
                      .first {
                        margin-top: 0; }
                
                      .align-center {
                        text-align: center; }
                
                      .align-right {
                        text-align: right; }
                
                      .align-left {
                        text-align: left; }
                
                      .clear {
                        clear: both; }
                
                      .mt0 {
                        margin-top: 0; }
                
                      .mb0 {
                        margin-bottom: 0; }
                
                      .preheader {
                        color: transparent;
                        display: none;
                        height: 0;
                        max-height: 0;
                        max-width: 0;
                        opacity: 0;
                        overflow: hidden;
                        mso-hide: all;
                        visibility: hidden;
                        width: 0; }
                
                      .powered-by a {
                        text-decoration: none; }
                
                      hr {
                        border: 0;
                        border-bottom: 1px solid #f6f6f6;
                        Margin: 20px 0; }
                
                      /* -------------------------------------
                          RESPONSIVE AND MOBILE FRIENDLY STYLES
                      ------------------------------------- */
                      @media only screen and (max-width: 620px) {
                        table[class=body] h1 {
                          font-size: 28px !important;
                          margin-bottom: 10px !important; }
                        table[class=body] p,
                        table[class=body] ul,
                        table[class=body] ol,
                        table[class=body] td,
                        table[class=body] span,
                        table[class=body] a {
                          font-size: 16px !important; }
                        table[class=body] .wrapper,
                        table[class=body] .article {
                          padding: 10px !important; }
                        table[class=body] .content {
                          padding: 0 !important; }
                        table[class=body] .container {
                          padding: 0 !important;
                          width: 100% !important; }
                        table[class=body] .main {
                          border-left-width: 0 !important;
                          border-radius: 0 !important;
                          border-right-width: 0 !important; }
                        table[class=body] .btn table {
                          width: 100% !important; }
                        table[class=body] .btn a {
                          width: 100% !important; }
                        table[class=body] .img-responsive {
                          height: auto !important;
                          max-width: 100% !important;
                          width: auto !important; }}
                
                      /* -------------------------------------
                          PRESERVE THESE STYLES IN THE HEAD
                      ------------------------------------- */
                      @media all {
                        .ExternalClass {
                          width: 100%; }
                        .ExternalClass,
                        .ExternalClass p,
                        .ExternalClass span,
                        .ExternalClass font,
                        .ExternalClass td,
                        .ExternalClass div {
                          line-height: 100%; }
                        .apple-link a {
                          color: inherit !important;
                          font-family: inherit !important;
                          font-size: inherit !important;
                          font-weight: inherit !important;
                          line-height: inherit !important;
                          text-decoration: none !important; }
                        .btn-primary table td:hover {
                          background-color: #34495e !important; }
                        .btn-primary a:hover {
                          background-color: #34495e !important;
                          border-color: #34495e !important; } }
                
                    </style>
                  </head>
                  <body class="">
                    <table border="0" cellpadding="0" cellspacing="0" class="body">
                      <tr>
                        <td>&nbsp;</td>
                        <td class="container">
                          <div class="content">
                
                            <!-- START CENTERED WHITE CONTAINER -->
                            <span class="preheader"> We’re thrilled to see you here as an early bird member. No fee is required in 2022.                  </span>
                            <table class="main">
                
                              <!-- START MAIN CONTENT AREA -->
                              <tr>
                                <td class="wrapper">
                                  <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                    <td>
                                      <p>
                                        <img alt="logo" src="https://firebasestorage.googleapis.com/v0/b/risefunds.appspot.com/o/static%2Flogo.PNG?alt=media&token=58351d17-3923-4ebf-98ce-0d1d0530cb6e" />
                                      </p>
                                    </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <p>Hey there Sonam & Ben & Arvinder</p>
                                        <p>We checked the portfolio of ${
                                          creativeUser.details.firstName
                                        }. It has all the neccessary information. Kindly see below.</p>                                    
                                        <p>Name: ${
                                          creativeUser.details.firstName
                                        } ${creativeUser.details.lastName} </p>
                                        <p>Contact: ${[
                                          creativeUser.email,
                                          creativeUser.details.website,
                                          creativeUser.details.instagram,
                                        ]
                                          .filter(
                                            (l) => typeof l !== 'undefined'
                                          )
                                          .join(',')}</p>
                                        <p>Digital Photo: ${
                                          creativeUser.documents.digitalPhoto
                                            ?.files[0].url
                                        }</p>
                                        <p>ID: ${
                                          (
                                            creativeUser.documents
                                              ?.identity as unknown as {
                                              url: string;
                                            }[]
                                          )[0]?.url
                                        }</p>
                                        <p>Address: ${
                                          (
                                            creativeUser.documents
                                              ?.proofOfAdress as unknown as {
                                              url: string;
                                            }[]
                                          )[0]?.url
                                        }</p>
    
                                        <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                    <tbody>
                                      <tr>
                                        <td align="left">
                                          <table border="0" cellpadding="0" cellspacing="0">
                                            <tbody>
                                              <tr>
                                                <td> <a href="http://localhost:3000/user/su/creative/${
                                                  creativeUser.id
                                                }" target="_blank">View Creative</a> </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                      </td>
                                    </tr>
                                  </table>
                                  <p>To communicate with ${
                                    creativeUser.details.firstName
                                  } ${
              creativeUser.details.lastName
            } directly, reply this email</p>
                                </td>
                              </tr>
                
                            <!-- END MAIN CONTENT AREA -->
                            </table>
                
                          <!-- END CENTERED WHITE CONTAINER -->
                          </div>
                        </td>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </body>
                </html>`,
          });
          creativeUser.profileCompletedEmailSent = true;
          await this.entityService.persist(creativeUser);
        }
      })
    );
  }

  async sendVerificationEmail(userId: string = ''): Promise<void> {
    const creativeUsers = await this.entityService.where({
      params: [
        { key: 'archive', value: false, operator: '==' },
        {
          key: 'isVerified',
          value: false,
          operator: '==',
        },
        { key: 'portoflioPercentage', value: 85, operator: '>=' },
        {
          key: 'id',
          value: userId,
          operator: '==',
        },
      ],
    });

    await Promise.all(
      creativeUsers.map(async (creativeUser) => {
        if (creativeUser.email) {
          await this.ExternalAddonService.MailgunExternalAddon.sendEmail({
            from: 'Risefunds Team <mailgun@sandboxc7499b3594524717a7e18b6c3e257f07.mailgun.org>',
            // to: `${creativeUser.email}`,
            to: 'Risefunds <uyioghosa19@gmail.com>',
            subject: `Verification Completed`,
            // cc: CC,
            html: `<!doctype html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width" />
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>Invitation Email</title>
                    <style>
                      /* -------------------------------------
                          GLOBAL RESETS
                      ------------------------------------- */
                      img {
                        border: none;
                        -ms-interpolation-mode: bicubic;
                        max-width: 100%; }
                
                      body {
                        background-color: #f6f6f6;
                        font-family: sans-serif;
                        -webkit-font-smoothing: antialiased;
                        font-size: 14px;
                        line-height: 1.4;
                        margin: 0;
                        padding: 0;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%; }
                
                      table {
                        border-collapse: separate;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        width: 100%; }
                        table td {
                          font-family: sans-serif;
                          font-size: 14px;
                          vertical-align: top; }
                
                      /* -------------------------------------
                          BODY & CONTAINER
                      ------------------------------------- */
                
                      .body {
                        background-color: #f6f6f6;
                        width: 100%; }
                
                      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                      .container {
                        display: block;
                        margin: 0 auto !important;
                        /* makes it centered */
                        max-width: 580px;
                        padding: 10px;
                        width: 580px; }
                
                      /* This should also be a block element, so that it will fill 100% of the .container */
                      .content {
                        box-sizing: border-box;
                        display: block;
                        margin: 0 auto;
                        max-width: 580px;
                        padding: 10px; }
                
                      /* -------------------------------------
                          HEADER, FOOTER, MAIN
                      ------------------------------------- */
                      .main {
                        background: #ffffff;
                        border-radius: 3px;
                        width: 100%; }
                
                      .wrapper {
                        box-sizing: border-box;
                        padding: 20px; }
                
                      .content-block {
                        padding-bottom: 10px;
                        padding-top: 10px;
                      }
                
                      .footer {
                        clear: both;
                        margin-top: 10px;
                        text-align: center;
                        width: 100%; }
                        .footer td,
                        .footer p,
                        .footer span,
                        .footer a {
                          color: #999999;
                          font-size: 12px;
                          text-align: center; }
                
                      /* -------------------------------------
                          TYPOGRAPHY
                      ------------------------------------- */
                      h1,
                      h2,
                      h3,
                      h4 {
                        color: #000000;
                        font-family: sans-serif;
                        font-weight: 400;
                        line-height: 1.4;
                        margin: 0;
                        margin-bottom: 30px; }
                
                      h1 {
                        font-size: 35px;
                        font-weight: 300;
                        text-align: center;
                        text-transform: capitalize; }
                
                      p,
                      ul,
                      ol {
                        font-family: sans-serif;
                        font-size: 14px;
                        font-weight: normal;
                        margin: 0;
                        margin-bottom: 15px; }
                        p li,
                        ul li,
                        ol li {
                          list-style-position: inside;
                          margin-left: 5px; }
                
                      a {
                        color: #000;
                        text-decoration: underline; }
                
                      /* -------------------------------------
                          BUTTONS
                      ------------------------------------- */
                      .btn {
                        box-sizing: border-box;
                        width: 100%; }
                        .btn > tbody > tr > td {
                          padding-bottom: 15px; }
                        .btn table {
                          width: auto; }
                        .btn table td {
                          background-color: #ffffff;
                          border-radius: 5px;
                          text-align: center; }
                        .btn a {
                          border: solid 1px #000;
                          box-sizing: border-box;
                          color: #000;
                          cursor: pointer;
                          display: inline-block;
                          font-size: 14px;
                          font-weight: bold;
                          margin: 0;
                          padding: 12px 25px;
                          text-decoration: none;
                          text-transform: capitalize; }
                
                      .btn-primary table td {
                        background-color: #000; }
                
                      .btn-primary a {
                        border-color: #000;
                        color: #ffffff; }
                
                      /* -------------------------------------
                          OTHER STYLES THAT MIGHT BE USEFUL
                      ------------------------------------- */
                      .last {
                        margin-bottom: 0; }
                
                      .first {
                        margin-top: 0; }
                
                      .align-center {
                        text-align: center; }
                
                      .align-right {
                        text-align: right; }
                
                      .align-left {
                        text-align: left; }
                
                      .clear {
                        clear: both; }
                
                      .mt0 {
                        margin-top: 0; }
                
                      .mb0 {
                        margin-bottom: 0; }
                
                      .preheader {
                        color: transparent;
                        display: none;
                        height: 0;
                        max-height: 0;
                        max-width: 0;
                        opacity: 0;
                        overflow: hidden;
                        mso-hide: all;
                        visibility: hidden;
                        width: 0; }
                
                      .powered-by a {
                        text-decoration: none; }
                
                      hr {
                        border: 0;
                        border-bottom: 1px solid #f6f6f6;
                        Margin: 20px 0; }
                
                      /* -------------------------------------
                          RESPONSIVE AND MOBILE FRIENDLY STYLES
                      ------------------------------------- */
                      @media only screen and (max-width: 620px) {
                        table[class=body] h1 {
                          font-size: 28px !important;
                          margin-bottom: 10px !important; }
                        table[class=body] p,
                        table[class=body] ul,
                        table[class=body] ol,
                        table[class=body] td,
                        table[class=body] span,
                        table[class=body] a {
                          font-size: 16px !important; }
                        table[class=body] .wrapper,
                        table[class=body] .article {
                          padding: 10px !important; }
                        table[class=body] .content {
                          padding: 0 !important; }
                        table[class=body] .container {
                          padding: 0 !important;
                          width: 100% !important; }
                        table[class=body] .main {
                          border-left-width: 0 !important;
                          border-radius: 0 !important;
                          border-right-width: 0 !important; }
                        table[class=body] .btn table {
                          width: 100% !important; }
                        table[class=body] .btn a {
                          width: 100% !important; }
                        table[class=body] .img-responsive {
                          height: auto !important;
                          max-width: 100% !important;
                          width: auto !important; }}
                
                      /* -------------------------------------
                          PRESERVE THESE STYLES IN THE HEAD
                      ------------------------------------- */
                      @media all {
                        .ExternalClass {
                          width: 100%; }
                        .ExternalClass,
                        .ExternalClass p,
                        .ExternalClass span,
                        .ExternalClass font,
                        .ExternalClass td,
                        .ExternalClass div {
                          line-height: 100%; }
                        .apple-link a {
                          color: inherit !important;
                          font-family: inherit !important;
                          font-size: inherit !important;
                          font-weight: inherit !important;
                          line-height: inherit !important;
                          text-decoration: none !important; }
                        .btn-primary table td:hover {
                          background-color: #34495e !important; }
                        .btn-primary a:hover {
                          background-color: #34495e !important;
                          border-color: #34495e !important; } }
                
                    </style>
                  </head>
                  <body class="">
                    <table border="0" cellpadding="0" cellspacing="0" class="body">
                      <tr>
                        <td>&nbsp;</td>
                        <td class="container">
                          <div class="content">
                
                            <!-- START CENTERED WHITE CONTAINER -->
                            <span class="preheader"> We’re thrilled to see you here as an early bird member. No fee is required in 2022.                  </span>
                            <table class="main">
                
                              <!-- START MAIN CONTENT AREA -->
                              <tr>
                                <td class="wrapper">
                                  <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                    <td>
                                      <p>
                                        <img alt="logo" src="https://firebasestorage.googleapis.com/v0/b/risefunds.appspot.com/o/static%2Flogo.PNG?alt=media&token=58351d17-3923-4ebf-98ce-0d1d0530cb6e" />
                                      </p>
                                    </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <p>Hey there ${creativeUser.details.firstName}</p>
                                        <p>Thank you for taking the time to provide us the neccessary information. Your campaigns are now eligible to be featured on our website.</p>    
    
                                        <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                    <tbody>
                                      <tr>
                                        <td align="left">
                                          <table border="0" cellpadding="0" cellspacing="0">
                                            <tbody>
                                              <tr>
                                                <td> <a href="http://localhost:3000/user/campaign" target="_blank">Create campaign</a> </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                
                            <!-- END MAIN CONTENT AREA -->
                            </table>
                
                          <!-- END CENTERED WHITE CONTAINER -->
                          </div>
                        </td>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </body>
                </html>`,
          });
          creativeUser.isVerified = true;
          await this.entityService.persist(creativeUser);
        }
      })
    );
  }

  async sendFeaturedEmail(userId: string = ''): Promise<void> {}

  async prv(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }

  async pub(
    feature: string,
    _data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    if (feature === 'sendProfileCompletedEmail') {
      const payload = _data as unknown as ICreativePaylod;
      await this.sendProfileCompletedEmail(payload.creativeId);
      return { message: 'Email sent' };
    }

    if (feature === 'sendVerificationEmail') {
      const payload = _data as unknown as ICreativePaylod;
      await this.sendVerificationEmail(payload.creativeId);
      return { message: 'User Verification updated successfully' };
    }
    return { message: 'Undefined' };
  }

  async webhook(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }
}
